import { env } from "../../config/env.js";

/**
 * Per-role model selection for the AI blog pipeline. Gemma-first (per
 * preference); the rest are fallbacks tried in order when Gemma is rate-limited
 * or errors. All are free OpenRouter models (verified via /api/v1/models).
 * Free models churn — override any role via OPENROUTER_MODEL_* env vars.
 */
export type ModelRole = "writer" | "researcher" | "seo" | "quality" | "imageQuery";

// Gemma first (per preference), then a WIDE chain of diverse free providers.
// Free models are throttled per-provider, so breadth across vendors (Google,
// Meta, OpenAI-oss, NVIDIA, Qwen, Nous) maximises the chance one is available.
const DEFAULTS: Record<ModelRole, string[]> = {
  writer: [
    "google/gemma-4-31b-it:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "openai/gpt-oss-120b:free",
    "nvidia/nemotron-3-super-120b-a12b:free",
    "nousresearch/hermes-3-llama-3.1-405b:free",
    "qwen/qwen3-next-80b-a3b-instruct:free",
  ],
  researcher: [
    "google/gemma-4-31b-it:free",
    "openai/gpt-oss-120b:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "nvidia/nemotron-3-super-120b-a12b:free",
    "qwen/qwen3-next-80b-a3b-instruct:free",
  ],
  seo: [
    "google/gemma-4-26b-a4b-it:free",
    "google/gemma-4-31b-it:free",
    "openai/gpt-oss-20b:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "qwen/qwen3-next-80b-a3b-instruct:free",
  ],
  quality: [
    "google/gemma-4-31b-it:free",
    "openai/gpt-oss-120b:free",
    "nvidia/nemotron-3-super-120b-a12b:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "qwen/qwen3-next-80b-a3b-instruct:free",
  ],
  imageQuery: [
    "google/gemma-4-26b-a4b-it:free",
    "google/gemma-4-31b-it:free",
    "meta-llama/llama-3.2-3b-instruct:free",
    "openai/gpt-oss-20b:free",
  ],
};

/** Returns the ordered model chain for a role (env override first, then defaults). */
export function modelsFor(role: ModelRole): string[] {
  const override = env.openrouter.models[role];
  const defaults = DEFAULTS[role];
  return override ? [override, ...defaults.filter((m) => m !== override)] : defaults;
}

/**
 * Gemma `it` chat templates reject a standalone `system` role. Detect Gemma so
 * openrouter.ts can fold the system prompt into the first user message.
 */
export function isGemma(model: string): boolean {
  return model.toLowerCase().includes("gemma");
}
