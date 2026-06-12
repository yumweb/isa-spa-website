import { Router } from "express";
import argon2 from "argon2";
import { z } from "zod";
import { prisma } from "@isa/db";
import { userCreateSchema, userUpdateSchema } from "@isa/shared";
import { requireRole } from "../../middleware/auth.js";
import { HttpError } from "../../middleware/error.js";
import { writeAudit } from "../../services/audit.js";

/**
 * Admin user management. ADMIN-only (enforced here in addition to the
 * `requireAuth` mount guard). passwordHash is NEVER selected/returned.
 * DELETE soft-disables (isActive=false) to preserve audit/FK history.
 */
export const usersAdminRouter = Router();
usersAdminRouter.use(requireRole("ADMIN"));

const safeSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;

const idParam = z.coerce.number().int().positive();

usersAdminRouter.get("/", async (_req, res, next) => {
  try {
    const items = await prisma.user.findMany({ select: safeSelect, orderBy: { createdAt: "desc" } });
    res.json({ items });
  } catch (e) {
    next(e);
  }
});

usersAdminRouter.get("/:id", async (req, res, next) => {
  try {
    const id = idParam.parse(req.params.id);
    const item = await prisma.user.findUnique({ where: { id }, select: safeSelect });
    if (!item) throw new HttpError(404, "User not found");
    res.json({ item });
  } catch (e) {
    next(e);
  }
});

usersAdminRouter.post("/", async (req, res, next) => {
  try {
    const { email, password, name, role, isActive } = userCreateSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new HttpError(409, "Email already in use");
    const passwordHash = await argon2.hash(password);
    const item = await prisma.user.create({
      data: { email, passwordHash, name, role, isActive },
      select: safeSelect,
    });
    await writeAudit(req, "user.create", `User:${item.id}`);
    res.status(201).json({ item });
  } catch (e) {
    next(e);
  }
});

usersAdminRouter.patch("/:id", async (req, res, next) => {
  try {
    const id = idParam.parse(req.params.id);
    const { name, password, role, isActive } = userUpdateSchema.parse(req.body);
    // Don't let an admin lock themselves out by self-demoting/disabling.
    if (id === req.user!.sub && (isActive === false || (role && role !== "ADMIN"))) {
      throw new HttpError(409, "You cannot demote or disable your own account");
    }
    const data: Record<string, unknown> = { name, role, isActive };
    if (password) data.passwordHash = await argon2.hash(password);
    const item = await prisma.user.update({ where: { id }, data, select: safeSelect });
    await writeAudit(req, "user.update", `User:${id}`);
    res.json({ item });
  } catch (e) {
    next(e);
  }
});

usersAdminRouter.delete("/:id", async (req, res, next) => {
  try {
    const id = idParam.parse(req.params.id);
    if (id === req.user!.sub) throw new HttpError(409, "You cannot disable your own account");
    const item = await prisma.user.update({
      where: { id },
      data: { isActive: false },
      select: safeSelect,
    });
    await writeAudit(req, "user.disable", `User:${id}`);
    res.json({ ok: true, item });
  } catch (e) {
    next(e);
  }
});
