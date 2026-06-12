import { Router } from "express";
import { z } from "zod";
import { HttpError } from "../../middleware/error.js";
import { writeAudit } from "../../services/audit.js";

/**
 * Minimal structural view of a Prisma model delegate. Prisma's generated
 * delegate types are heavily overloaded/generic and differ per model, so we
 * narrow to the handful of methods this factory needs and bypass input typing
 * (args: unknown) — validation already happens via Zod at the boundary.
 */
export type Delegate = {
  findMany: (args?: unknown) => Promise<unknown[]>;
  findUnique: (args: unknown) => Promise<unknown>;
  create: (args: unknown) => Promise<unknown>;
  update: (args: unknown) => Promise<unknown>;
  delete: (args: unknown) => Promise<unknown>;
};

type InputMapper = (data: Record<string, unknown>) => Record<string, unknown>;

interface CrudOptions {
  /** Prisma delegate, e.g. `prisma.location` (cast via `asDelegate`). */
  model: Delegate;
  /** Prisma model name used in the audit entity tag, e.g. "Location". */
  entity: string;
  /** Audit action prefix, e.g. "location" -> "location.create". */
  name: string;
  /** Create-body Zod schema (ZodObject so `.partial()` works for PATCH). */
  schema: z.ZodObject<z.ZodRawShape>;
  /** Transform validated input into Prisma `data` (seo flatten, dates, …). */
  mapInput?: InputMapper;
  /** Extra args for list (orderBy / include / where). */
  listArgs?: Record<string, unknown>;
  /** Extra args for single fetch (include). */
  getArgs?: Record<string, unknown>;
}

/** Cast a concrete Prisma delegate to the structural `Delegate` type. */
export function asDelegate(model: unknown): Delegate {
  return model as Delegate;
}

const idParam = z.coerce.number().int().positive();
const identity: InputMapper = (d) => d;

/**
 * Build a standard REST CRUD router for one CMS entity. Response shapes are
 * fixed by contract: list -> { items }, single -> { item }, delete -> { ok }.
 * Every mutation writes an AuditLog row.
 */
export function createCrudRouter(opts: CrudOptions): Router {
  const router = Router();
  const map = opts.mapInput ?? identity;
  const updateSchema = opts.schema.partial();

  router.get("/", async (_req, res, next) => {
    try {
      const items = await opts.model.findMany(opts.listArgs);
      res.json({ items });
    } catch (e) {
      next(e);
    }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      const id = idParam.parse(req.params.id);
      const item = await opts.model.findUnique({ where: { id }, ...opts.getArgs });
      if (!item) throw new HttpError(404, `${opts.entity} not found`);
      res.json({ item });
    } catch (e) {
      next(e);
    }
  });

  router.post("/", async (req, res, next) => {
    try {
      const data = map(opts.schema.parse(req.body));
      const item = (await opts.model.create({ data })) as { id: number };
      await writeAudit(req, `${opts.name}.create`, `${opts.entity}:${item.id}`);
      res.status(201).json({ item });
    } catch (e) {
      next(e);
    }
  });

  router.patch("/:id", async (req, res, next) => {
    try {
      const id = idParam.parse(req.params.id);
      const data = map(updateSchema.parse(req.body));
      const item = await opts.model.update({ where: { id }, data });
      await writeAudit(req, `${opts.name}.update`, `${opts.entity}:${id}`);
      res.json({ item });
    } catch (e) {
      next(e);
    }
  });

  router.delete("/:id", async (req, res, next) => {
    try {
      const id = idParam.parse(req.params.id);
      await opts.model.delete({ where: { id } });
      await writeAudit(req, `${opts.name}.delete`, `${opts.entity}:${id}`);
      res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  });

  return router;
}
