import { Router } from "express";
import { z } from "zod";
import { prisma } from "@isa/db";
import { aiBlogGenerateSchema, GENERATION_STATUSES } from "@isa/shared";
import { HttpError } from "../../middleware/error.js";
import { writeAudit } from "../../services/audit.js";
import { generateNow } from "../../services/ai-blog/index.js";

export const aiBlogAdminRouter: Router = Router();

// POST /api/admin/ai-blog/generate — kick off a manual run (fire-and-forget).
aiBlogAdminRouter.post("/generate", async (req, res, next) => {
  try {
    const input = aiBlogGenerateSchema.parse(req.body ?? {});
    const runId = await generateNow({ ...input, trigger: "MANUAL", triggeredBy: req.user?.sub });
    await writeAudit(req, "aiBlog.generate", `BlogGenerationRun:${runId}`, { topic: input.topic });
    res.status(202).json({ runId, status: "PENDING" });
  } catch (e) {
    next(e);
  }
});

// GET /api/admin/ai-blog/runs?status=&page=&pageSize=
const listQuery = z.object({
  status: z.enum(GENERATION_STATUSES).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

aiBlogAdminRouter.get("/runs", async (req, res, next) => {
  try {
    const { status, page, pageSize } = listQuery.parse(req.query);
    const where = status ? { status } : {};
    const [items, total] = await Promise.all([
      prisma.blogGenerationRun.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.blogGenerationRun.count({ where }),
    ]);
    res.json({ items, total, page, pageSize });
  } catch (e) {
    next(e);
  }
});

// GET /api/admin/ai-blog/runs/:id — poll a single run.
aiBlogAdminRouter.get("/runs/:id", async (req, res, next) => {
  try {
    const id = z.coerce.number().int().parse(req.params.id);
    const run = await prisma.blogGenerationRun.findUnique({ where: { id } });
    if (!run) throw new HttpError(404, "Run not found");
    res.json({ run });
  } catch (e) {
    next(e);
  }
});
