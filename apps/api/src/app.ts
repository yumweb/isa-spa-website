import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { pinoHttp } from "pino-http";
import { env } from "./config/env.js";
import { logger } from "./lib/logger.js";
import { errorHandler, notFound } from "./middleware/error.js";
import { authRouter } from "./routes/auth.routes.js";
import { publicRouter } from "./routes/public.routes.js";
import { submissionsRouter } from "./routes/submissions.routes.js";

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

  app.use("/api/auth", authRouter);
  app.use("/api", publicRouter); // GET content
  app.use("/api/submissions", submissionsRouter); // POST forms + admin
  // TODO (next session): /api/admin/* CRUD for locations, services, blog,
  // testimonials, gallery, careers, media, settings, redirects.

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
