/**
 * Provider-agnostic LLM layer.
 *
 * Milestone 2 adds adapters here (anthropic.ts, openai.ts) plus a
 * `getProvider()` factory that reads LLM_PROVIDER from env. All generation
 * features (case studies, listings, content ideas) must go through this
 * interface — never import a vendor SDK from feature code.
 */

export interface GenerationRequest {
  system: string;
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}

export interface GenerationResult {
  text: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
}

export interface LLMProvider {
  readonly name: string;
  generate(request: GenerationRequest): Promise<GenerationResult>;
}
