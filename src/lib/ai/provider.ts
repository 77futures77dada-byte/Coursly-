/**
 * AI provider abstraction (spec section 22).
 *
 * The model market moves fast — the best model for lesson summaries or exercise
 * generation today may not be OpenAI's in 12 months. Everything in the app calls
 * this interface; swapping providers means writing one new adapter, not touching
 * call sites. Every generation records which model produced it so the UI can
 * label AI-generated content honestly.
 *
 * NOTE: all AI features are out of MVP scope. This file exists so the seam is in
 * place from day one and nothing hardcodes a vendor SDK.
 */

export type AITaskType = "exercise" | "explanation" | "flashcards" | "lesson_summary";

export interface AIGeneration {
  content: unknown;
  model: string;
  provider: string;
}

export interface AIProvider {
  readonly name: string;
  generate(input: { type: AITaskType; prompt: string; context?: unknown }): Promise<AIGeneration>;
}

class UnconfiguredProvider implements AIProvider {
  readonly name = "unconfigured";
  async generate(): Promise<AIGeneration> {
    throw new Error(
      "No AI provider configured. Set AI_PROVIDER and the matching credentials, " +
        "and add an adapter in src/lib/ai/adapters/.",
    );
  }
}

// Adapters (openai, anthropic, …) will be registered here.
const REGISTRY: Record<string, () => AIProvider> = {};

export function getAIProvider(): AIProvider {
  const key = process.env.AI_PROVIDER ?? "";
  const factory = REGISTRY[key];
  return factory ? factory() : new UnconfiguredProvider();
}
