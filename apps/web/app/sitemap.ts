import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";
import { getLocations, getServices } from "@/lib/api";

/** Dynamic sitemap: static routes + CMS-driven locations/services/blog. */
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
  ].map((p) => ({ url: `${SITE.url}${p}`, changeFrequency: "weekly" as const }));

  const [locations, categories] = await Promise.all([
    getLocations().catch(() => []),
    getServices().catch(() => []),
  ]);

  return [
    ...staticPaths,
    ...locations.map((l) => ({ url: `${SITE.url}/spa-locator/${l.slug}` })),
    ...categories.map((c) => ({ url: `${SITE.url}/services/${c.slug}` })),
  ];
}
