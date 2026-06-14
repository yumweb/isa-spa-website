import { prisma } from "@isa/db";
import { CONTENT_PILLARS, type BlogAudience, type ContentPillar } from "@isa/shared";

/**
 * The real ISA Spa service menu, formatted for prompts. This is the SOURCE OF
 * TRUTH the generator must stay within — it must never invent treatments ISA
 * doesn't offer. Pulled live from the CMS-managed ServiceCategory/Service rows.
 */
export async function getServiceCatalogue(): Promise<string> {
  const cats = await prisma.serviceCategory.findMany({
    orderBy: { order: "asc" },
    include: { services: { orderBy: { order: "asc" }, select: { name: true, duration: true } } },
  });
  if (cats.length === 0) return "(No services configured in the CMS yet.)";
  // Prices are deliberately omitted — they vary by location and must never
  // appear in generated posts.
  return cats
    .map((c) => {
      const items = c.services
        .map((s) => `${s.name}${s.duration ? ` (${s.duration})` : ""}`)
        .join("; ");
      return `• ${c.name}: ${items || "(no items)"}`;
    })
    .join("\n");
}

/** Recent post titles (for the researcher's duplication check). */
export async function getExistingTitles(limit = 100): Promise<string[]> {
  const rows = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    select: { title: true },
  });
  return rows.map((r) => r.title);
}

/** Published slugs (for the writer to add real internal links). */
export async function getPublishedSlugs(limit = 100): Promise<string[]> {
  const rows = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: limit,
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}

const STOP = new Set(["the", "a", "an", "of", "for", "and", "to", "in", "your", "with", "is", "best"]);

function tokenSet(s: string): Set<string> {
  return new Set(
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP.has(w)),
  );
}

/** Jaccard similarity of two strings' significant words. */
function jaccard(a: string, b: string): number {
  const sa = tokenSet(a);
  const sb = tokenSet(b);
  if (sa.size === 0 || sb.size === 0) return 0;
  let inter = 0;
  for (const w of sa) if (sb.has(w)) inter++;
  return inter / (sa.size + sb.size - inter);
}

/** True if `candidate` substantially overlaps any existing title. */
export function isDuplicate(candidate: string, existing: string[], threshold = 0.7): boolean {
  return existing.some((t) => jaccard(candidate, t) >= threshold);
}

/**
 * Choose a pillar + audience for a run. An explicit pillar/audience wins;
 * otherwise rotate by the post count so scheduled runs cycle through every
 * audience and pillar over time. An explicit pillar string is matched back to
 * a known pillar to recover its audience (falls back to the given/Consumer).
 */
export async function pickPillar(
  explicitPillar?: string,
  explicitAudience?: BlogAudience,
): Promise<ContentPillar> {
  if (explicitPillar) {
    const match = CONTENT_PILLARS.find((p) => p.pillar === explicitPillar);
    return match ?? { audience: explicitAudience ?? "Consumer", pillar: explicitPillar };
  }
  if (explicitAudience) {
    const pool = CONTENT_PILLARS.filter((p) => p.audience === explicitAudience);
    const count = await prisma.blogPost.count();
    return pool[count % pool.length]!;
  }
  const count = await prisma.blogPost.count();
  return CONTENT_PILLARS[count % CONTENT_PILLARS.length]!;
}

/** Current month/year for seasonal angles. */
export function seasonHint(now = new Date()): string {
  return now.toLocaleString("en-IN", { month: "long", year: "numeric" });
}

/**
 * Infer the target audience from a manual topic (+ keywords) so a typed topic
 * routes to the right audience even when none is explicitly chosen. Franchise
 * and hotel signals are checked first (they're more specific); otherwise the
 * topic is treated as Consumer.
 */
export function inferAudience(text: string): BlogAudience {
  const t = ` ${text.toLowerCase()} `;
  const franchise =
    /\b(franchis\w*|investor|investment|roi|return on investment|entrepreneur\w*|unit economics|own(ing)? a spa|ownership|business model|expansion)\b/;
  const hotel =
    /\b(hotel\w*|hospitality|guest\w*|resort\w*|property|occupancy|amenit\w*|tourism|in-?room|check-?in)\b/;
  if (franchise.test(t)) return "Franchise";
  if (hotel.test(t)) return "Hotel";
  return "Consumer";
}
