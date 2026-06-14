import { randomBytes } from "node:crypto";
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { prisma } from "@isa/db";
import { env } from "../../config/env.js";
import { logger } from "../../lib/logger.js";

export type CoverResult = { url: string; source: "pexels" | "unsplash" } | null;

async function downloadToMedia(imageUrl: string, alt: string, mime = "image/jpeg"): Promise<string> {
  const res = await fetch(imageUrl);
  if (!res.ok) throw new Error(`image download ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await mkdir(env.uploadsDir, { recursive: true });
  const ext = mime.includes("png") ? "png" : "jpg";
  const filename = `${Date.now()}-${randomBytes(6).toString("hex")}.${ext}`;
  await writeFile(join(env.uploadsDir, filename), buf);
  const url = `/uploads/${filename}`;
  await prisma.media.create({ data: { filename, url, mime, alt } });
  return url;
}

/**
 * Steer queries toward modest, culturally-appropriate spa imagery (India,
 * conservative audience): bias to ambiance/objects and exclude body/skin terms.
 */
function modestQuery(query: string): string {
  const bad = /\b(massage|body|back|nude|naked|bikini|swimsuit|skin|topless|shoulder|spine|towel wrap)\b/gi;
  const cleaned = query.replace(bad, " ").replace(/\s+/g, " ").trim();
  return `${cleaned || "luxury spa"} spa wellness ambiance candles flowers`.trim();
}

async function fromPexels(query: string): Promise<string | null> {
  if (!env.pexelsKey) return null;
  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(modestQuery(query))}&orientation=landscape&per_page=1`,
    { headers: { Authorization: env.pexelsKey } },
  );
  if (!res.ok) return null;
  const data = (await res.json()) as { photos?: { src?: { large2x?: string; large?: string } }[] };
  return data.photos?.[0]?.src?.large2x ?? data.photos?.[0]?.src?.large ?? null;
}

async function fromUnsplash(query: string): Promise<string | null> {
  if (!env.unsplashKey) return null;
  // content_filter=high applies Unsplash's strictest safe-search.
  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(modestQuery(query))}&orientation=landscape&content_filter=high&per_page=1`,
    { headers: { Authorization: `Client-ID ${env.unsplashKey}` } },
  );
  if (!res.ok) return null;
  const data = (await res.json()) as { results?: { urls?: { regular?: string } }[] };
  return data.results?.[0]?.urls?.regular ?? null;
}

/**
 * Source a cover image for a topic: Pexels → Unsplash. Queries are steered to
 * modest spa ambiance/objects (no exposed bodies). Best-effort — any failure
 * returns null and the post keeps the front-end placeholder.
 */
export async function findCover(query: string, alt: string): Promise<CoverResult> {
  try {
    const pexels = await fromPexels(query);
    if (pexels) return { url: await downloadToMedia(pexels, alt), source: "pexels" };
  } catch (err) {
    logger.warn({ err: (err as Error).message }, "pexels cover failed");
  }
  try {
    const unsplash = await fromUnsplash(query);
    if (unsplash) return { url: await downloadToMedia(unsplash, alt), source: "unsplash" };
  } catch (err) {
    logger.warn({ err: (err as Error).message }, "unsplash cover failed");
  }
  return null;
}
