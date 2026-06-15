import { ISA_CONTEXT } from "../context.js";
import type { ChatPrompt } from "../openrouter.js";
import type { ResearchOutput, WriteOutput } from "../types.js";

export function seoPrompt(params: { research: ResearchOutput; write: WriteOutput }): ChatPrompt {
  const { research, write } = params;
  const system = `You are an SEO/AEO specialist for ISA Spa (India's luxury spa).

${ISA_CONTEXT}

Produce search metadata and a self-assessed SEO score for the article.

RULES
- metaTitle: <= 60 chars, includes the primary keyword, compelling. May end with " | ISA Spa" only if it still fits.
- metaDescription: 140-160 chars, primary keyword in the first 100 chars, with a soft CTA.
- structuredData: a valid schema.org FAQPage JSON-LD object built from the article's FAQ (mainEntity array of Question/acceptedAnswer). Omit if no FAQ.
- seoScore: 0-100 honest estimate (keyword usage, title/desc quality, heading structure, AEO answerability).

OUTPUT — return ONLY valid JSON, no markdown:
{
  "metaTitle": "…",
  "metaDescription": "…",
  "seoScore": 82,
  "structuredData": { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [ … ] }
}`;

  const user = `Title: ${write.title}
Primary keyword: ${research.targetKeywords[0] ?? ""}
All keywords: ${research.targetKeywords.join(", ")}
Excerpt: ${write.excerpt}
FAQ: ${write.faqItems.map((f) => `Q: ${f.question} A: ${f.answer}`).join(" || ") || "(none)"}

Return the SEO JSON.`;

  return { system, user };
}
