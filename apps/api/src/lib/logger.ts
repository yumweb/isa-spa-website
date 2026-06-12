import { pino } from "pino";
import { env } from "../config/env.js";

export const logger = pino({
  level: env.isProd ? "info" : "debug",
  // Never log secrets/PII — redact common sensitive paths.
  redact: ["req.headers.authorization", "req.headers.cookie", "*.password", "*.passwordHash"],
  transport: env.isProd ? undefined : { target: "pino-pretty", options: { colorize: true } },
});
