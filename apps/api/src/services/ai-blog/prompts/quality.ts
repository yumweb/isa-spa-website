import type { BlogAudience } from "@isa/shared";
import { AI_ISM_PHRASES, ISA_CONTEXT } from "../context.js";
import type { ChatPrompt } from "../openrouter.js";
import type { WriteOutput } from "../types.js";

export function qualityPrompt(params: {
  write: WriteOutput;
  audience: BlogAudience;
  serviceCatalogue: string;
  minScore: number;
}): ChatPrompt {
  const { write } = params;
  const business = params.audience !== "Consumer";
  const system = `You are a strict content quality auditor for ISA Spa's blog.

${ISA_CONTEXT}

ISA SPA SERVICE MENU — the ONLY treatments ISA offers:
${params.serviceCatalogue}

AUDIENCE: ${params.audience}. ${
    business
      ? "This is a B2B article (business/opportunity focus). Do NOT penalise it for not detailing treatments — judge it on business substance, credibility and the right CTA."
      : "This is a consumer wellness article — it should revolve around real ISA treatments."
  }

Grade the article out of 100. Be strict and specific.

SERVICE ACCURACY GATE (critical, all audiences): if the article names or recommends ANY spa treatment that is NOT in the menu above (e.g. Abhyanga, Shirodhara, hot-stone, Thai), list each in "issues" prefixed with "OFF-MENU: ", deduct 15 points per off-menu treatment, and set passedQuality=false.

NO-PRICING GATE (critical, all audiences): if the article states or implies ANY price, fee, cost, ₹/Rs figure, "from ₹…", discount or package rate, list each in "issues" prefixed with "PRICING: ", deduct 15 points each, and set passedQuality=false. Pricing varies by location and must never appear.

RUBRIC
- Content quality (35): substance, original angle, ~900+ words, correct readable HTML, varied sentences.
- AEO/SEO structure (30): TL;DR "Key Takeaways" block present; >=2 question-style H2s; direct answers under them; FAQ section with 3-5 Q&As; sensible heading hierarchy; 1-3 internal /blog or site links.
- Metadata (15): title compelling & unique; excerpt 100-300 chars; 3-7 relevant tags.
- Brand alignment (20): warm/serene luxury tone; India-appropriate; keywords natural; NO medical claims.

DEDUCT 2 points per AI-cliché phrase found (any case):
${AI_ISM_PHRASES.map((p) => `- "${p}"`).join("\n")}

passedQuality = qualityScore >= ${params.minScore}.

OUTPUT — return ONLY valid JSON, no markdown:
{
  "qualityScore": 84,
  "passedQuality": true,
  "qualityNotes": "1-3 sentence summary",
  "aiIsmsFound": ["phrase if any"],
  "issues": ["specific actionable issue", "…"]
}`;

  const user = `TITLE: ${write.title}
EXCERPT: ${write.excerpt}
TAGS: ${write.tags.join(", ")}

BODY HTML:
${write.body}

Grade it. Return ONLY the JSON.`;

  return { system, user };
}
