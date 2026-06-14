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

  // ── AI blog generator ──
  openrouter: {
    apiKey: process.env.OPENROUTER_API_KEY ?? "",
    baseUrl: process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1",
    // OpenRouter asks for these to attribute traffic; harmless defaults.
    referer: process.env.OPENROUTER_REFERER ?? "https://isaspa.in",
    title: process.env.OPENROUTER_TITLE ?? "ISA Spa CMS",
    // Per-role model overrides (else the Gemma-first defaults in models.ts apply).
    models: {
      writer: process.env.OPENROUTER_MODEL_WRITER,
      researcher: process.env.OPENROUTER_MODEL_RESEARCHER,
      seo: process.env.OPENROUTER_MODEL_SEO,
      quality: process.env.OPENROUTER_MODEL_QUALITY,
      imageQuery: process.env.OPENROUTER_MODEL_IMAGE_QUERY,
    },
  },
  pexelsKey: process.env.PEXELS_API_KEY ?? "",
  unsplashKey: process.env.UNSPLASH_ACCESS_KEY ?? "",
  // On-demand ISR revalidation of the Next web app after CMS content changes.
  revalidate: {
    url: process.env.REVALIDATE_URL ?? "",
    secret: process.env.REVALIDATE_SECRET ?? "",
  },
  aiBlog: {
    enabled: process.env.AI_BLOG_ENABLED === "true",
    cron: process.env.AI_BLOG_CRON ?? "0 3 * * 1", // weekly, Mon 03:00
    minQuality: Number(process.env.AI_BLOG_MIN_QUALITY ?? 70),
    maxRetries: Number(process.env.AI_BLOG_MAX_RETRIES ?? 1),
  },
} as const;
