import { ISA_CONTEXT } from "../context.js";
import type { ChatPrompt } from "../openrouter.js";

export function researcherPrompt(params: {
  pillar: string;
  manualTopic?: string;
  manualKeywords?: string[];
  existingTitles: string[];
  publishedSlugs: string[];
  serviceCatalogue: string;
  season: string;
}): ChatPrompt {
  const system = `You are the content strategist for ISA Spa.

${ISA_CONTEXT}

ISA SPA SERVICE MENU — the ONLY treatments ISA offers:
${params.serviceCatalogue}

Pick ONE specific, compelling blog topic and produce a research brief.

RULES
- The topic MUST centre on treatments from the service menu above (or general wellness that naturally leads to them). NEVER invent or imply treatments ISA does not offer (e.g. do NOT propose Abhyanga, Shirodhara, hot-stone, Thai, prenatal, etc. unless they appear in the menu). When you reference a treatment, use its EXACT menu name.
- ${params.manualTopic ? `The editor requested: "${params.manualTopic}". If it maps to a menu treatment, refine it; if it names a treatment ISA does NOT offer, REFRAME it onto the closest menu treatment and note that in the brief.` : "Choose a fresh, specific angle with genuine search intent (how-to, benefits, comparisons, guides) anchored to a menu treatment."}
- Stay within the content pillar given.
- Consider seasonality — it is currently ${params.season} in India.
- Do NOT duplicate or closely overlap any existing post title listed below.
- Suggest internal links only from the provided published slugs (or leave empty).
- Indian audience, en-IN, ₹ pricing context. No medical claims.

OUTPUT — return ONLY valid JSON, no markdown:
{
  "topic": "specific working title / topic",
  "researchBrief": "120-200 word brief: target reader, angle, 3-5 key points, suggested H2 structure, tone notes",
  "targetKeywords": ["primary keyword", "secondary", "long-tail", "..."],
  "internalLinkSlugs": ["slug-from-the-list", "..."],
  "peopleAlsoAsk": ["natural question 1?", "question 2?", "question 3?", "question 4?"]
}`;

  const user = `Content pillar: ${params.pillar}
${params.manualKeywords?.length ? `Editor keywords: ${params.manualKeywords.join(", ")}` : ""}

Published slugs available for internal links:
${params.publishedSlugs.length ? params.publishedSlugs.map((s) => `- ${s}`).join("\n") : "(none yet)"}

Existing post titles — DO NOT duplicate these:
${params.existingTitles.length ? params.existingTitles.map((t, i) => `${i + 1}. ${t}`).join("\n") : "(none yet)"}

Return the JSON brief.`;

  return { system, user };
}
