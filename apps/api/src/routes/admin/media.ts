import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { Router } from "express";
import multer from "multer";
import { z } from "zod";
import { prisma } from "@isa/db";
import { env } from "../../config/env.js";
import { HttpError } from "../../middleware/error.js";
import { logger } from "../../lib/logger.js";
import { writeAudit } from "../../services/audit.js";

/**
 * Media library backed by local disk (apps/api/uploads, gitignored). Files are
 * served statically at /uploads in app.ts; the stored `url` is `/uploads/<file>`
 * so the admin/web can reference it directly. Swap diskStorage for S3/R2 later
 * without changing the API contract.
 */
export const mediaAdminRouter = Router();

// Ensure the upload directory exists before multer writes to it.
fs.mkdirSync(env.uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, env.uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const id = crypto.randomBytes(8).toString("hex");
    cb(null, `${Date.now()}-${id}${ext}`);
  },
});

const ALLOWED = /^(image\/(jpeg|png|webp|gif|avif|svg\+xml)|application\/pdf)$/;

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB
  fileFilter: (_req, file, cb) => {
    if (ALLOWED.test(file.mimetype)) cb(null, true);
    else cb(new HttpError(415, `Unsupported media type: ${file.mimetype}`));
  },
});

mediaAdminRouter.get("/", async (_req, res, next) => {
  try {
    const items = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });
    res.json({ items });
  } catch (e) {
    next(e);
  }
});

mediaAdminRouter.post("/", upload.single("file"), async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) throw new HttpError(400, "No file uploaded (field 'file')");
    const alt = z.string().trim().max(300).optional().parse(req.body?.alt);
    const item = await prisma.media.create({
      data: {
        filename: file.originalname,
        url: `/uploads/${file.filename}`,
        mime: file.mimetype,
        alt,
      },
    });
    await writeAudit(req, "media.create", `Media:${item.id}`);
    res.status(201).json({ item });
  } catch (e) {
    next(e);
  }
});

mediaAdminRouter.delete("/:id", async (req, res, next) => {
  try {
    const id = z.coerce.number().int().positive().parse(req.params.id);
    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) throw new HttpError(404, "Media not found");
    await prisma.media.delete({ where: { id } });
    // Best-effort unlink — the DB row is the source of truth.
    const filePath = path.join(env.uploadsDir, path.basename(media.url));
    fs.promises.unlink(filePath).catch((err) => logger.warn({ err, id }, "Media file unlink failed"));
    await writeAudit(req, "media.delete", `Media:${id}`);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});
