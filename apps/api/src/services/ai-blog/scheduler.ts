import cron from "node-cron";
import { env } from "../../config/env.js";
import { logger } from "../../lib/logger.js";
import { createRun, executeRun } from "./index.js";

let started = false;

/**
 * Start the weekly auto-generation cron. No-op unless AI_BLOG_ENABLED=true and a
 * valid cron + OpenRouter key are configured. Runs are serialised (one at a time)
 * and rotate through content pillars via pickPillar().
 */
export function startBlogScheduler(): void {
  if (started) return;
  if (!env.aiBlog.enabled) {
    logger.info("ai-blog scheduler disabled (AI_BLOG_ENABLED!=true)");
    return;
  }
  if (!env.openrouter.apiKey) {
    logger.warn("ai-blog scheduler enabled but OPENROUTER_API_KEY is missing — skipping");
    return;
  }
  if (!cron.validate(env.aiBlog.cron)) {
    logger.error({ cron: env.aiBlog.cron }, "invalid AI_BLOG_CRON — scheduler not started");
    return;
  }

  let running = false;
  cron.schedule(env.aiBlog.cron, async () => {
    if (running) {
      logger.warn("ai-blog scheduled run skipped — previous run still in progress");
      return;
    }
    running = true;
    try {
      const runId = await createRun({ trigger: "SCHEDULED" });
      logger.info({ runId }, "ai-blog scheduled run started");
      await executeRun(runId, { trigger: "SCHEDULED" });
    } catch (err) {
      logger.error({ err: (err as Error).message }, "ai-blog scheduled run error");
    } finally {
      running = false;
    }
  });
  started = true;
  logger.info({ cron: env.aiBlog.cron }, "ai-blog scheduler started");
}
