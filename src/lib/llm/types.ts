import type { ZodType } from "zod";

/**
 * Provider-agnostic LLM layer.
 *
 * Feature code (case-study generation, listing copy, content ideas) must go
 * through `getProvider()` from `./index` — never import a vendor SDK directly.
 * Adapters: anthropic.ts (production), mock.ts (dev without an API key).
 */

export interface StructuredRequest<T> {
  system: string;
  prompt: string;
  /** Output is validated against this schema before being returned. */
  schema: ZodType<T>;
  maxTokens?: number;
}

export interface StructuredResult<T> {
  data: T;
  model: string;
  inputTokens: number;
  outputTokens: number;
}

export interface LLMProvider {
  readonly name: string;
  generateStructured<T>(
    request: StructuredRequest<T>,
  ): Promise<StructuredResult<T>>;
}
