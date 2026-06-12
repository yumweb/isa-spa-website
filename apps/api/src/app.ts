import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { pinoHttp } from "pino-http";
import { env } from "./config/env.js";
import { logger } from "./lib/logger.js";
import { errorHandler, notFound } from "./middleware/error.js";
import { requireAuth } from "./middleware/auth.js";
import { authRouter } from "./routes/auth.routes.js";
import { publicRouter } from "./routes/public.routes.js";
import { submissionsRouter } from "./routes/submissions.routes.js";
import {
  locationsAdminRouter,
  serviceCategoriesAdminRouter,
  servicesAdminRouter,
  blogAdminRouter,
  testimonialsAdminRouter,
  galleryAdminRouter,
  careersAdminRouter,
  pagesAdminRouter,
  redirectsAdminRouter,
  usersAdminRouter,
  mediaAdminRouter,
  settingsAdminRouter,
} from "./routes/admin/index.js";
import { aiBlogAdminRouter } from "./routes/admin/ai-blog.js";

export function createApp() {
  const app = express();
  app.set("trust proxy", 1); // correct req.ip behind a proxy/load balancer

  app.use(helmet());
  app.use(
    cors({
      origin: (origin, cb) =>
        !origin || env.corsOrigins.includes(origin)
          ? cb(null, true)
          : cb(new Error("Not allowed by CORS")),
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());
  app.use(pinoHttp({ logger }));

  app.get("/health", (_req, res) => res.json({ status: "ok" }));

  // Local media files (dev). Served before routers; path is gitignored.
  app.use("/uploads", express.static(env.uploadsDir));

  app.use("/api/auth", authRouter);
  app.use("/api", publicRouter); // GET content
  app.use("/api/submissions", submissionsRouter); // POST forms + admin

  // ── Admin CMS CRUD (all require a valid access token) ──
  app.use("/api/admin/locations", requireAuth, locationsAdminRouter);
  app.use("/api/admin/service-categories", requireAuth, serviceCategoriesAdminRouter);
  app.use("/api/admin/services", requireAuth, servicesAdminRouter);
  app.use("/api/admin/blog", requireAuth, blogAdminRouter);
  app.use("/api/admin/testimonials", requireAuth, testimonialsAdminRouter);
  app.use("/api/admin/gallery", requireAuth, galleryAdminRouter);
  app.use("/api/admin/careers", requireAuth, careersAdminRouter);
  app.use("/api/admin/pages", requireAuth, pagesAdminRouter);
  app.use("/api/admin/redirects", requireAuth, redirectsAdminRouter);
  app.use("/api/admin/media", requireAuth, mediaAdminRouter);
  app.use("/api/admin/settings", requireAuth, settingsAdminRouter);
  app.use("/api/admin/users", requireAuth, usersAdminRouter); // router also enforces ADMIN
  app.use("/api/admin/ai-blog", requireAuth, aiBlogAdminRouter);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
