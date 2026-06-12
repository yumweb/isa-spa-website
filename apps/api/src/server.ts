import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./lib/logger.js";
import { startBlogScheduler } from "./services/ai-blog/scheduler.js";

const app = createApp();
app.listen(env.port, () => {
  logger.info(`API listening on http://localhost:${env.port}`);
  startBlogScheduler(); // no-op unless AI_BLOG_ENABLED=true
});
