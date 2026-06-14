import { prisma, Prisma } from "@isa/db";
import type { BlogAudience, GenerationTrigger } from "@isa/shared";
import { env } from "../../config/env.js";
import { logger } from "../../lib/logger.js";
import { chatJson } from "./openrouter.js";
import { researchOutput, writeOutput, seoOutput, qualityOutput, imageQueryOutput, type QualityOutput, type RunContext, type TokenUse } from "./types.js";
import { researcherPrompt } from "./prompts/researcher.js";
import { writerPrompt } from "./prompts/writer.js";
import { seoPrompt } from "./prompts/seo.js";
import { qualityPrompt } from "./prompts/quality.js";
import { getExistingTitles, getPublishedSlugs, getServiceCatalogue, inferAudience, pickPillar, seasonHint } from "./topics.js";
import { findCover } from "./images.js";

export type GenerateOptions = {
  topic?: string;
  keywords?: string[];
  pillar?: string;
  audience?: BlogAudience;
  trigger: GenerationTrigger;
  triggeredBy?: number;
};

/** Insert a PENDING run row and return its id (so callers can poll). */
export async function createRun(opts: GenerateOptions): Promise<number> {
  const run = await prisma.blogGenerationRun.create({
    data: {
      status: "PENDING",
      trigger: opts.trigger,
      triggeredBy: opts.triggeredBy,
      topic: opts.topic,
      pillar: opts.pillar,
    },
  });
  return run.id;
}

/** Fire-and-forget: create a run and execute it in the background. Returns runId. */
export async function generateNow(opts: GenerateOptions): Promise<number> {
  const runId = await createRun(opts);
  void executeRun(runId, opts).catch((err) =>
    logger.error({ err: (err as Error).message, runId }, "ai-blog run crashed"),
  );
  return runId;
}

async function uniqueSlug(base: string): Promise<string> {
  let slug = base;
  for (let i = 2; i < 50; i++) {
    const exists = await prisma.blogPost.findUnique({ where: { slug }, select: { id: true } });
    if (!exists) return slug;
    slug = `${base}-${i}`;
  }
  return `${base}-${Date.now()}`;
}

function track(ctx: RunContext, role: string, r: { model: string; inputTokens: number; outputTokens: number }): void {
  const t: TokenUse = { role, model: r.model, inputTokens: r.inputTokens, outputTokens: r.outputTokens };
  ctx.tokens.push(t);
}

/** Run the full pipeline for an existing run row, updating it as it progresses. */
export async function executeRun(runId: number, opts: GenerateOptions): Promise<void> {
  const startedAt = Date.now();
  const ctx: RunContext = {
    runId,
    trigger: opts.trigger,
    triggeredBy: opts.triggeredBy,
    topic: opts.topic,
    keywords: opts.keywords,
    pillar: opts.pillar,
    retryCount: 0,
    tokens: [],
  };

  const setStep = (currentStep: string) =>
    prisma.blogGenerationRun.update({ where: { id: runId }, data: { status: "RUNNING", currentStep } });

  try {
    // 1) Research / topic selection
    await setStep("researching");
    // Resolve audience: explicit wins; else infer from a manual topic; else
    // (scheduled, no topic) pickPillar rotates across all audiences.
    const audience =
      opts.audience ??
      (!opts.pillar && opts.topic
        ? inferAudience(`${opts.topic} ${(opts.keywords ?? []).join(" ")}`)
        : undefined);
    const picked = await pickPillar(opts.pillar, audience);
    ctx.pillar = picked.pillar;
    ctx.audience = picked.audience;
    const [existingTitles, publishedSlugs, serviceCatalogue] = await Promise.all([
      getExistingTitles(),
      getPublishedSlugs(),
      getServiceCatalogue(),
    ]);
    const research = await chatJson(
      "researcher",
      researcherPrompt({
        audience: picked.audience,
        pillar: picked.pillar,
        manualTopic: opts.topic,
        manualKeywords: opts.keywords,
        existingTitles,
        publishedSlugs,
        serviceCatalogue,
        season: seasonHint(),
      }),
      researchOutput,
    );
    track(ctx, "researcher", research);
    ctx.research = research.data;
    await prisma.blogGenerationRun.update({
      where: { id: runId },
      data: { topic: research.data.topic, pillar: picked.pillar },
    });

    // 2) Write → 3) SEO → 4) Quality, with one retry if QA fails
    let retryNotes: string | undefined;
    for (let attempt = 0; ; attempt++) {
      await setStep(attempt === 0 ? "writing" : "rewriting");
      const write = await chatJson(
        "writer",
        writerPrompt({ audience: picked.audience, research: research.data, publishedSlugs, serviceCatalogue, retryNotes }),
        writeOutput,
      );
      track(ctx, "writer", write);
      ctx.write = write.data;

      // SEO — non-fatal: a throttled free model shouldn't waste the article.
      // Fall back to deriving meta from the post itself.
      await setStep("seo");
      try {
        const seo = await chatJson("seo", seoPrompt({ research: research.data, write: write.data }), seoOutput);
        track(ctx, "seo", seo);
        ctx.seo = seo.data;
      } catch (err) {
        logger.warn({ err: (err as Error).message, runId }, "seo step failed — deriving fallback meta");
        ctx.seo = {
          metaTitle: write.data.title.slice(0, 70),
          metaDescription: write.data.excerpt.slice(0, 160),
          seoScore: 0,
        };
      }

      // Quality — non-fatal: if it can't grade, accept the draft (a human reviews
      // it anyway before publishing).
      await setStep("quality");
      let q: QualityOutput | null = null;
      try {
        const quality = await chatJson("quality", qualityPrompt({ write: write.data, audience: picked.audience, serviceCatalogue, minScore: env.aiBlog.minQuality }), qualityOutput);
        track(ctx, "quality", quality);
        q = quality.data;
      } catch (err) {
        logger.warn({ err: (err as Error).message, runId }, "quality step failed — skipping gate");
      }
      // Deterministic price gate — independent of the (rate-limit-prone) quality
      // LLM. Concrete currency amounts (₹2 crore, Rs 1,499, etc.) must never
      // appear; word-level "investment"/"%" are fine. Forces a rewrite if found.
      const priceHits = [...write.data.body.matchAll(/(?:₹|\bRs\.?\s*)\s?\d[\d,.]*\s*(?:lakh|crore|cr|k|l)?/gi)]
        .map((m) => m[0].trim())
        .slice(0, 6);

      const llmPassed = q?.passedQuality ?? true; // skipped gate counts as pass
      const passed = llmPassed && priceHits.length === 0;
      ctx.quality = q
        ? { ...q, passedQuality: passed, issues: [...q.issues, ...priceHits.map((h) => `PRICING: ${h}`)] }
        : {
            qualityScore: 0,
            passedQuality: passed,
            qualityNotes: "Quality check skipped (model unavailable).",
            aiIsmsFound: [],
            issues: priceHits.map((h) => `PRICING: ${h}`),
          };

      if (passed || attempt >= env.aiBlog.maxRetries) break;
      ctx.retryCount = attempt + 1;
      retryNotes = [
        ...(q?.issues ?? []),
        ...(q?.aiIsmsFound ?? []).map((p) => `Remove phrase: "${p}"`),
        ...priceHits.map((h) => `Remove the price figure "${h}" — never state any ₹ amount; say it varies by location.`),
      ].join("\n");
      await prisma.blogGenerationRun.update({ where: { id: runId }, data: { retryCount: ctx.retryCount } });
    }

    // 5) Cover image (best-effort)
    await setStep("image");
    try {
      const q = await chatJson(
        "imageQuery",
        {
          system:
            "You produce a short stock-photo search query for a luxury Indian spa blog (conservative culture). " +
            "MODESTY RULE: the image must NOT show exposed skin, bare backs/shoulders, swimwear, or intimate body close-ups. " +
            "Prefer spa AMBIANCE and OBJECTS: interiors, candles, flowers, essential oils & bottles, stacked towels, lotus, " +
            "herbal tea, stones, product flat-lays, a hand holding flowers/oil. Return ONLY JSON.",
          user: `Topic: ${ctx.research!.topic}\nReturn {"query":"3-6 words of modest spa ambiance/objects, e.g. 'spa candles flowers oils' or 'luxury spa interior towels'"}`,
        },
        imageQueryOutput,
      );
      track(ctx, "imageQuery", q);
      const cover = await findCover(q.data.query, ctx.write!.title);
      ctx.coverImage = cover?.url ?? null;
      ctx.imageSource = cover?.source ?? "none";
    } catch (err) {
      logger.warn({ err: (err as Error).message, runId }, "cover image step failed");
      ctx.coverImage = null;
      ctx.imageSource = "none";
    }

    // 6) Persist DRAFT
    await setStep("saving");
    const slug = await uniqueSlug(ctx.write!.slug);
    const post = await prisma.blogPost.create({
      data: {
        title: ctx.write!.title,
        slug,
        excerpt: ctx.write!.excerpt,
        body: ctx.write!.body,
        coverImage: ctx.coverImage,
        ogImage: ctx.coverImage,
        author: "ISA Spa Editorial",
        tags: ctx.write!.tags,
        status: "DRAFT",
        metaTitle: ctx.seo!.metaTitle,
        metaDescription: ctx.seo!.metaDescription,
      },
    });

    await prisma.blogGenerationRun.update({
      where: { id: runId },
      data: {
        status: "COMPLETED",
        currentStep: "completed",
        blogPostId: post.id,
        seoScore: ctx.seo!.seoScore,
        qualityScore: ctx.quality!.qualityScore,
        imageSource: ctx.imageSource,
        generationMs: Date.now() - startedAt,
        metadata: {
          tokens: ctx.tokens,
          totalInputTokens: ctx.tokens.reduce((s, t) => s + t.inputTokens, 0),
          totalOutputTokens: ctx.tokens.reduce((s, t) => s + t.outputTokens, 0),
          models: ctx.tokens.map((t) => `${t.role}:${t.model}`),
          structuredData: ctx.seo!.structuredData ?? null,
          qualityNotes: ctx.quality!.qualityNotes,
        } as Prisma.InputJsonObject,
      },
    });
    logger.info({ runId, postId: post.id, slug, quality: ctx.quality!.qualityScore }, "ai-blog draft created");
  } catch (err) {
    await prisma.blogGenerationRun.update({
      where: { id: runId },
      data: {
        status: "FAILED",
        errorMessage: (err as Error).message?.slice(0, 1000),
        generationMs: Date.now() - startedAt,
        metadata: { tokens: ctx.tokens } as Prisma.InputJsonObject,
      },
    });
    logger.error({ runId, err: (err as Error).message }, "ai-blog run failed");
  }
}
