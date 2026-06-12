import { Router } from "express";
import { z } from "zod";
import { prisma } from "@isa/db";
import { writeAudit } from "../../services/audit.js";

/**
 * Key/value site settings. GET returns a single keyed object the admin can
 * spread into a form; PUT upserts one key. `value` is arbitrary JSON.
 */
export const settingsAdminRouter = Router();

settingsAdminRouter.get("/", async (_req, res, next) => {
  try {
    const rows = await prisma.setting.findMany();
    const settings: Record<string, unknown> = {};
    for (const row of rows) settings[row.key] = row.value;
    res.json({ settings });
  } catch (e) {
    next(e);
  }
});

const keyParam = z.string().trim().min(1).max(120);
const bodySchema = z.object({ value: z.unknown() });

settingsAdminRouter.put("/:key", async (req, res, next) => {
  try {
    const key = keyParam.parse(req.params.key);
    const { value } = bodySchema.parse(req.body);
    const setting = await prisma.setting.upsert({
      where: { key },
      create: { key, value: value as object },
      update: { value: value as object },
    });
    await writeAudit(req, "setting.update", `Setting:${key}`);
    res.json({ setting });
  } catch (e) {
    next(e);
  }
});
