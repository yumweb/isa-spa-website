/**
 * Input mappers: bridge the shared Zod schemas (which nest SEO fields under a
 * `seo` object and use ISO strings for dates) to the flat Prisma columns
 * (metaTitle, metaDescription, ogImage, canonical; DateTime).
 *
 * On PATCH the schemas are `.partial()`, so a key is present only when the
 * client sent it — undefined values are left out and Prisma ignores them.
 */

/** Flatten a nested `seo` object up to the top level (all four SEO columns). */
export function flattenSeo(data: Record<string, unknown>): Record<string, unknown> {
  const { seo, ...rest } = data;
  if (seo && typeof seo === "object") {
    return { ...rest, ...(seo as Record<string, unknown>) };
  }
  return rest;
}

/** ServiceCategory only has metaTitle/metaDescription columns — pick those. */
export function mapCategoryInput(data: Record<string, unknown>): Record<string, unknown> {
  const { seo, ...rest } = data;
  const s = (seo ?? {}) as Record<string, unknown>;
  return { ...rest, metaTitle: s.metaTitle, metaDescription: s.metaDescription };
}

/** Blog: flatten SEO and coerce the ISO `publishedAt` string to a Date. */
export function mapBlogInput(data: Record<string, unknown>): Record<string, unknown> {
  const flat = flattenSeo(data);
  if ("publishedAt" in flat) {
    const v = flat.publishedAt;
    flat.publishedAt = v ? new Date(v as string) : null;
  }
  return flat;
}
