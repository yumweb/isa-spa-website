import "dotenv/config";
import path from "node:path";

function req(key: string, fallback?: string): string {
  const v = process.env[key] ?? fallback;
  if (v === undefined) throw new Error(`Missing required env var: ${key}`);
  return v;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  isProd: process.env.NODE_ENV === "production",
  port: Number(process.env.API_PORT ?? 4000),
  corsOrigins: (process.env.CORS_ORIGINS ?? "http://localhost:3000,http://localhost:5173")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  jwt: {
    accessSecret: req("JWT_ACCESS_SECRET", "dev-access-secret"),
    refreshSecret: req("JWT_REFRESH_SECRET", "dev-refresh-secret"),
    accessTtl: process.env.JWT_ACCESS_TTL ?? "15m",
    refreshTtl: process.env.JWT_REFRESH_TTL ?? "7d",
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    notifyTo: process.env.LEADS_NOTIFY_TO,
  },
  turnstileSecret: process.env.TURNSTILE_SECRET,
  // Local media upload dir. cwd is apps/api (see ecosystem.config.cjs / dev),
  // so this resolves to apps/api/uploads (gitignored). Served at /uploads.
  uploadsDir: process.env.UPLOADS_DIR ?? path.resolve(process.cwd(), "uploads"),
} as const;
