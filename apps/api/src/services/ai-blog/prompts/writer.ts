import { ISA_CONTEXT } from "../context.js";
import type { ChatPrompt } from "../openrouter.js";
import type { ResearchOutput } from "../types.js";

export function writerPrompt(params: {
  research: ResearchOutput;
  publishedSlugs: string[];
  retryNotes?: string;
}): ChatPrompt {
  const { research } = params;
  const system = `You are a senior wellness & lifestyle writer for ISA Spa.

${ISA_CONTEXT}

Write a complete, publish-ready blog article in British/Indian English (en-IN).

STYLE
- Warm, serene, sensory and elegant. Short paragraphs (2-4 sentences). Active voice.
- NEVER use AI-cliché phrases ("in conclusion", "delve into", "in today's fast-paced world", "tapestry", "elevate your", etc.).
- Weave the primary keyword in naturally; no keyword stuffing. No medical claims.

HTML BODY REQUIREMENTS (the "body" field is raw HTML, no <html>/<head>)
- 900-1500 words.
- Open with: <div class="tldr"><h3>Key Takeaways</h3><ul><li>…3-5 bullets…</li></ul></div>
- Use <h2>, <h3>, <p>, <ul>/<li>, <strong>, <em>, <blockquote>.
- At least 2 of the <h2> headings MUST be phrased as questions (use the "peopleAlsoAsk" list).
- The first 1-2 sentences under each question-<h2> must DIRECTLY answer it (for AI answer engines).
- Include 1-3 internal links as <a href="/blog/SLUG">…</a>, using ONLY these slugs: ${params.publishedSlugs.length ? params.publishedSlugs.join(", ") : "(none — skip internal links)"}.
- End the body with <div class="faq-section"><h2>Frequently Asked Questions</h2>…<h3>question</h3><p>answer</p>…</div> mirroring faqItems.
- Close with a gentle CTA to book a ritual or find a nearby ISA Spa (link <a href="/spa-locator">…</a> or <a href="/appointment">…</a>).
${params.retryNotes ? `\nREVISION — the previous draft was rejected by QA. Fix these issues:\n${params.retryNotes}` : ""}

OUTPUT — return ONLY valid JSON, no markdown:
{
  "title": "compelling H1 (<= 70 chars ideally)",
  "slug": "lowercase-hyphenated-slug",
  "excerpt": "150-300 char summary",
  "body": "<div class=\\"tldr\\">…full HTML…</div>",
  "tags": ["tag1", "tag2", "tag3"],
  "readingTimeMinutes": 6,
  "faqItems": [{ "question": "…?", "answer": "…" }]
}`;

  const user = `Topic: ${research.topic}

Research brief:
${research.researchBrief}

Primary + secondary keywords: ${research.targetKeywords.join(", ")}
People also ask (use as question H2s / FAQ): ${research.peopleAlsoAsk.join(" | ")}

Write the full article JSON now.`;

  return { system, user };
}
