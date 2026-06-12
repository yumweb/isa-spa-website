import { ISA_CONTEXT } from "../context.js";
import type { ChatPrompt } from "../openrouter.js";

export function researcherPrompt(params: {
  pillar: string;
  manualTopic?: string;
  manualKeywords?: string[];
  existingTitles: string[];
  publishedSlugs: string[];
  season: string;
}): ChatPrompt {
  const system = `You are the content strategist for ISA Spa.

${ISA_CONTEXT}

Pick ONE specific, compelling blog topic and produce a research brief.

RULES
- Stay within the content pillar given.
- ${params.manualTopic ? `The editor requested this topic: "${params.manualTopic}". Refine it into a strong, specific angle.` : "Choose a fresh, specific angle with genuine search intent (how-to, benefits, comparisons, guides)."}
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
