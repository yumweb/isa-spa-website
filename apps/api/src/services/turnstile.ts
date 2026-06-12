import { env } from "../config/env.js";
import { logger } from "../lib/logger.js";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/**
 * Verify a Cloudflare Turnstile token. When no secret is configured (dev),
 * this is a no-op that passes — captcha is opt-in via TURNSTILE_SECRET.
 * Returns false on a missing/invalid token or network failure (fail-closed
 * once captcha is enabled) so the caller can reject the submission.
 */
export async function verifyTurnstile(token: string | undefined, ip?: string): Promise<boolean> {
  if (!env.turnstileSecret) return true; // captcha disabled — pass through
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret: env.turnstileSecret, response: token });
    if (ip) body.append("remoteip", ip);
    const res = await fetch(VERIFY_URL, { method: "POST", body });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    logger.error({ err }, "Turnstile verification request failed");
    return false;
  }
}
