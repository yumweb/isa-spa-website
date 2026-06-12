import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { prisma, Prisma } from "@isa/db";
import { formSchemas, submissionEnvelope, SUBMISSION_STATUSES, FORM_TYPES } from "@isa/shared";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { notifyNewLead } from "../services/notify.js";
import { verifyTurnstile } from "../services/turnstile.js";
import { HttpError } from "../middleware/error.js";

export const submissionsRouter = Router();

// ── Public: submit any form (rate-limited, honeypot-checked) ──
const submitLimiter = rateLimit({ windowMs: 60_000, max: 8, standardHeaders: true });

submissionsRouter.post("/", submitLimiter, async (req, res, next) => {
  try {
    const { type, sourcePage } = submissionEnvelope.parse(req.body);
    const schema = formSchemas[type];
    const data = schema.parse(req.body) as Record<string, unknown>;

    // Honeypot: bots fill hidden field. Pretend success, store nothing.
    if (data.honeypot) {
      res.status(202).json({ ok: true });
      return;
    }
    delete data.honeypot;

    // Cloudflare Turnstile: no-op unless TURNSTILE_SECRET is set (see service).
    const captchaToken = typeof data.captchaToken === "string" ? data.captchaToken : undefined;
    if (!(await verifyTurnstile(captchaToken, req.ip))) {
      throw new HttpError(400, "Captcha verification failed");
    }
    delete data.captchaToken;

    const submission = await prisma.formSubmission.create({
      data: {
        type,
        payload: data as Prisma.InputJsonObject,
        sourcePage,
        ip: req.ip,
        userAgent: req.get("user-agent") ?? undefined,
      },
    });
    void notifyNewLead(type, submission.id, data);
    res.status(201).json({ ok: true, id: submission.id });
  } catch (e) {
    next(e);
  }
});

// ── Admin: list / view / update leads ──
const listQuery = z.object({
  type: z.enum(FORM_TYPES).optional(),
  status: z.enum(SUBMISSION_STATUSES).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
});

submissionsRouter.get("/admin", requireAuth, async (req, res, next) => {
  try {
    const { type, status, page, pageSize } = listQuery.parse(req.query);
    const where = { ...(type && { type }), ...(status && { status }) };
    const [items, total] = await Promise.all([
      prisma.formSubmission.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { assignee: { select: { id: true, name: true, email: true } } },
      }),
      prisma.formSubmission.count({ where }),
    ]);
    res.json({ items, total, page, pageSize });
  } catch (e) {
    next(e);
  }
});

const updateSchema = z.object({
  status: z.enum(SUBMISSION_STATUSES).optional(),
  assignedTo: z.number().int().nullable().optional(),
  notes: z.string().max(4000).optional(),
});

submissionsRouter.patch("/admin/:id", requireAuth, async (req, res, next) => {
  try {
    const id = z.coerce.number().int().parse(req.params.id);
    const data = updateSchema.parse(req.body);
    const updated = await prisma.formSubmission.update({ where: { id }, data });
    await prisma.auditLog.create({
      data: { userId: req.user!.sub, action: "submission.update", entity: `FormSubmission:${id}` },
    });
    res.json({ submission: updated });
  } catch (e) {
    next(e);
  }
});

// CSV export of leads
submissionsRouter.get("/admin/export", requireAuth, requireRole("ADMIN"), async (req, res, next) => {
  try {
    const { type } = z.object({ type: z.enum(FORM_TYPES).optional() }).parse(req.query);
    const rows = await prisma.formSubmission.findMany({
      where: type ? { type } : undefined,
      orderBy: { createdAt: "desc" },
    });
    const header = "id,type,status,created_at,payload\n";
    const csv =
      header +
      rows
        .map(
          (r) =>
            `${r.id},${r.type},${r.status},${r.createdAt.toISOString()},"${JSON.stringify(
              r.payload,
            ).replace(/"/g, '""')}"`,
        )
        .join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="leads.csv"');
    res.send(csv);
  } catch (e) {
    next(e);
  }
});
