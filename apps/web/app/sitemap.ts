import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";
import { getLocations, getServices, getBlogPosts, getCareers } from "@/lib/api";

/** Dynamic sitemap: static routes + CMS-driven locations/services/blog/careers. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    "",
    "/about-us",
    "/services",
    "/isa-spa-membership",
    "/spa-locator",
    "/franchise",
    "/hotel-partnership",
    "/gallery",
    "/blog",
    "/careers",
    "/contact-us",
    "/isa-spa-gift-cards",
    "/appointment",
    "/privacy-policy",
    "/refund-policy",
    "/terms",
  ].map((p) => ({ url: `${SITE.url}${p}`, changeFrequency: "weekly" as const }));

  const [locations, categories, posts, careers] = await Promise.all([
    getLocations().catch(() => []),
    getServices().catch(() => []),
    getBlogPosts().catch(() => []),
    getCareers().catch(() => []),
  ]);

  return [
    ...staticPaths,
    ...locations.map((l) => ({ url: `${SITE.url}/spa-locator/${l.slug}` })),
    ...categories.map((c) => ({ url: `${SITE.url}/services/${c.slug}` })),
    ...posts.map((p) => ({
      url: `${SITE.url}/blog/${p.slug}`,
      lastModified: p.publishedAt ? new Date(p.publishedAt) : undefined,
    })),
    ...careers.map((j) => ({ url: `${SITE.url}/careers/${j.slug}` })),
  ];
}
