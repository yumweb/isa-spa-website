import nodemailer from "nodemailer";
import type { FormType } from "@isa/shared";
import { env } from "../config/env.js";
import { logger } from "../lib/logger.js";

/**
 * Notify staff of a new lead. No-op (logs only) when SMTP is unconfigured,
 * so dev never blocks on email. Failures are swallowed — a lead is already
 * persisted; notification is best-effort.
 */
export async function notifyNewLead(type: FormType, id: number, payload: unknown): Promise<void> {
  if (!env.smtp.host || !env.smtp.notifyTo) {
    logger.info({ type, id }, "New lead (email notify skipped — SMTP not configured)");
    return;
  }
  try {
    const transport = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.port === 465,
      auth: env.smtp.user ? { user: env.smtp.user, pass: env.smtp.pass } : undefined,
    });
    await transport.sendMail({
      from: env.smtp.user,
      to: env.smtp.notifyTo,
      subject: `New ${type} lead #${id} — ISA Spa`,
      text: `A new ${type} enquiry was submitted.\n\n${JSON.stringify(payload, null, 2)}`,
    });
  } catch (err) {
    logger.error({ err, type, id }, "Lead notification failed");
  }
}
