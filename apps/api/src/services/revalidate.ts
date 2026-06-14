import { env } from "../config/env.js";
import { logger } from "../lib/logger.js";

/**
 * Ask the Next.js web app to revalidate (refresh the ISR cache for) the given
 * paths — called after CMS content changes so published edits appear without
 * waiting for the revalidate window. Fire-and-forget and best-effort: a failure
 * never blocks the CMS mutation (the page still refreshes on its normal window).
 */
export function revalidate(paths: string[]): void {
  if (!env.revalidate.url || !env.revalidate.secret || paths.length === 0) return;
  void (async () => {
    try {
      const res = await fetch(env.revalidate.url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-revalidate-secret": env.revalidate.secret },
        body: JSON.stringify({ paths }),
      });
      if (!res.ok) logger.warn({ status: res.status, paths }, "revalidate request failed");
    } catch (err) {
      logger.warn({ err: (err as Error).message, paths }, "revalidate request errored");
    }
  })();
}
