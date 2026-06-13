import { AI_ISM_PHRASES, ISA_CONTEXT } from "../context.js";
import type { ChatPrompt } from "../openrouter.js";
import type { WriteOutput } from "../types.js";

export function qualityPrompt(params: { write: WriteOutput; serviceCatalogue: string; minScore: number }): ChatPrompt {
  const { write } = params;
  const system = `You are a strict content quality auditor for ISA Spa's blog.

${ISA_CONTEXT}

ISA SPA SERVICE MENU — the ONLY treatments ISA offers:
${params.serviceCatalogue}

Grade the article out of 100. Be strict and specific.

SERVICE ACCURACY GATE (critical): if the article names or recommends ANY spa treatment that is NOT in the menu above (e.g. Abhyanga, Shirodhara, hot-stone, Thai), list each in "issues", deduct 15 points per off-menu treatment, and set passedQuality=false. List any such treatments in "issues" prefixed with "OFF-MENU: ".

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
