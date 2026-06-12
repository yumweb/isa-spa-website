import type { Request } from "express";
import { prisma } from "@isa/db";

/**
 * Append an audit-trail row. Best-effort context: `userId` comes from the
 * authenticated request (null for system actions). `entity` is "<Model>:<id>".
 * Kept tiny so every CMS mutation can call it in one line.
 */
export async function writeAudit(
  req: Request,
  action: string,
  entity: string,
  meta?: Record<string, unknown>,
): Promise<void> {
  await prisma.auditLog.create({
    data: {
      userId: req.user?.sub ?? null,
      action,
      entity,
      ...(meta !== undefined ? { meta: meta as object } : {}),
    },
  });
}
