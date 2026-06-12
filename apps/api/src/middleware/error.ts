import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "@isa/db";
import { logger } from "../lib/logger.js";

/** Typed domain error for explicit HTTP failures. */
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
  }
}

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ error: "Not found" });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ZodError) {
    res.status(422).json({ error: "Validation failed", issues: err.flatten() });
    return;
  }
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message, details: err.details });
    return;
  }
  // Map common Prisma errors so CRUD misses don't surface as 500s.
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      res.status(404).json({ error: "Not found" });
      return;
    }
    if (err.code === "P2002") {
      res.status(409).json({ error: "Unique constraint violation", details: err.meta?.target });
      return;
    }
    if (err.code === "P2003") {
      res.status(409).json({ error: "Related record constraint failed" });
      return;
    }
  }
  logger.error({ err }, "Unhandled error");
  res.status(500).json({ error: "Internal server error" });
}
