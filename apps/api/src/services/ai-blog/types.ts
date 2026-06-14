import { z } from "zod";
import type { BlogAudience, GenerationTrigger } from "@isa/shared";

/** Validated JSON shapes returned by each LLM step. */

export const researchOutput = z.object({
  topic: z.string().min(4),
  researchBrief: z.string().min(20),
  targetKeywords: z.array(z.string()).min(1).max(12),
  internalLinkSlugs: z.array(z.string()).max(5).default([]),
  peopleAlsoAsk: z.array(z.string()).min(2).max(8),
});
export type ResearchOutput = z.infer<typeof researchOutput>;

export const writeOutput = z.object({
  title: z.string().min(8).max(180),
  slug: z
    .string()
    .min(3)
    .max(180)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "lowercase hyphenated slug"),
  excerpt: z.string().min(40).max(320),
  body: z.string().min(400), // full HTML
  tags: z.array(z.string()).min(2).max(8),
  readingTimeMinutes: z.coerce.number().int().min(1).max(60).optional(),
  faqItems: z
    .array(z.object({ question: z.string().min(4), answer: z.string().min(4) }))
    .max(8)
    .default([]),
});
export type WriteOutput = z.infer<typeof writeOutput>;

export const seoOutput = z.object({
  metaTitle: z.string().min(10).max(70),
  metaDescription: z.string().min(50).max(165),
  seoScore: z.coerce.number().int().min(0).max(100),
  structuredData: z.record(z.unknown()).optional(), // JSON-LD (FAQPage/Article)
});
export type SeoOutput = z.infer<typeof seoOutput>;

export const qualityOutput = z.object({
  qualityScore: z.coerce.number().int().min(0).max(100),
  passedQuality: z.boolean(),
  qualityNotes: z.string().default(""),
  aiIsmsFound: z.array(z.string()).default([]),
  issues: z.array(z.string()).default([]),
});
export type QualityOutput = z.infer<typeof qualityOutput>;

export const imageQueryOutput = z.object({
  query: z.string().min(2).max(80),
});

/** Token/cost accounting appended per LLM call. */
export type TokenUse = {
  role: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
};

/** Shared state threaded through the pipeline. */
export type RunContext = {
  runId: number;
  trigger: GenerationTrigger;
  triggeredBy?: number;
  // inputs
  topic?: string;
  keywords?: string[];
  pillar?: string;
  audience?: BlogAudience;
  // step outputs
  research?: ResearchOutput;
  write?: WriteOutput;
  seo?: SeoOutput;
  quality?: QualityOutput;
  coverImage?: string | null;
  imageSource?: "pexels" | "unsplash" | "none";
  // control / accounting
  retryCount: number;
  tokens: TokenUse[];
};
