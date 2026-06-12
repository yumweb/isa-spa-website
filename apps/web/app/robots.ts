import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";

/** Allow AI answer-engine crawlers (AEO/GEO) alongside standard bots. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"], allow: "/" },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
