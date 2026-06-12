import { z } from "zod";
import { env } from "../../config/env.js";
import { logger } from "../../lib/logger.js";
import { HttpError } from "../../middleware/error.js";
import { isGemma, modelsFor, type ModelRole } from "./models.js";

export type ChatPrompt = { system: string; user: string };
export type ChatResult<T> = { data: T; model: string; inputTokens: number; outputTokens: number };

const TIMEOUT_MS = 120_000;
const RETRY_DELAYS = [4_000, 12_000, 30_000]; // backoff per model before falling through

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Strip markdown fences / prose and isolate the JSON object, then repair common
 * LLM mistakes (trailing commas) before parsing. Avoids a jsonrepair dependency.
 */
function parseLooseJson(raw: string): unknown {
  let s = raw.trim();
  // Remove ```json ... ``` fences
  s = s.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  const first = s.indexOf("{");
  const last = s.lastIndexOf("}");
  if (first !== -1 && last !== -1 && last > first) s = s.slice(first, last + 1);
  s = s.replace(/,(\s*[}\]])/g, "$1"); // trailing commas
  return JSON.parse(s);
}

type RawResponse = {
  choices?: { message?: { content?: string } }[];
  usage?: { prompt_tokens?: number; completion_tokens?: number };
  error?: { message?: string };
};

async function callOnce(model: string, prompt: ChatPrompt): Promise<RawResponse> {
  // Gemma `it` rejects a separate system role — fold it into the user turn.
  const messages = isGemma(model)
    ? [{ role: "user", content: `${prompt.system}\n\n---\n\n${prompt.user}` }]
    : [
        { role: "system", content: prompt.system },
        { role: "user", content: prompt.user },
      ];

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${env.openrouter.baseUrl}/chat/completions`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${env.openrouter.apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": env.openrouter.referer,
        "X-Title": env.openrouter.title,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        response_format: { type: "json_object" },
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      const err = new Error(`OpenRouter ${res.status}: ${body.slice(0, 200)}`);
      (err as Error & { status?: number }).status = res.status;
      throw err;
    }
    return (await res.json()) as RawResponse;
  } finally {
    clearTimeout(timer);
  }
}

function isRetryable(err: unknown): boolean {
  const status = (err as { status?: number })?.status;
  if (status === 429 || (status && status >= 500)) return true;
  // network / abort / no status
  return status === undefined;
}

/**
 * Request a JSON completion for a role. Tries each model in the role's chain;
 * within a model, retries transient errors with backoff. Validates against the
 * provided Zod schema. Throws HttpError(502) if the whole chain fails.
 */
export async function chatJson<S extends z.ZodTypeAny>(
  role: ModelRole,
  prompt: ChatPrompt,
  schema: S,
): Promise<ChatResult<z.infer<S>>> {
  if (!env.openrouter.apiKey) {
    throw new HttpError(503, "OPENROUTER_API_KEY is not configured");
  }
  const chain = modelsFor(role);
  let lastErr: unknown;

  for (const model of chain) {
    for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
      try {
        const raw = await callOnce(model, prompt);
        const content = raw.choices?.[0]?.message?.content;
        if (!content) throw new Error(raw.error?.message ?? "Empty completion");
        const parsed = parseLooseJson(content);
        const data = schema.parse(parsed);
        return {
          data,
          model,
          inputTokens: raw.usage?.prompt_tokens ?? 0,
          outputTokens: raw.usage?.completion_tokens ?? 0,
        };
      } catch (err) {
        lastErr = err;
        const retryable = isRetryable(err);
        logger.warn(
          { role, model, attempt, retryable, err: (err as Error).message },
          "ai-blog LLM call failed",
        );
        // Zod/JSON parse errors aren't worth retrying the same model many times,
        // but one retry can help; rate/server errors get the full backoff.
        if (retryable && attempt < RETRY_DELAYS.length) {
          await sleep(RETRY_DELAYS[attempt]!);
          continue;
        }
        break; // fall through to next model
      }
    }
  }
  throw new HttpError(502, `AI generation failed for "${role}": ${(lastErr as Error)?.message ?? "unknown"}`);
}
