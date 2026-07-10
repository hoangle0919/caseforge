import { AnthropicProvider } from "./anthropic";
import { MockProvider } from "./mock";
import type { LLMProvider } from "./types";

export type { LLMProvider, StructuredRequest, StructuredResult } from "./types";

let provider: LLMProvider | null = null;

/** LLM_PROVIDER=anthropic (default) | mock. Swap providers here, not in feature code. */
export function getProvider(): LLMProvider {
  if (provider) return provider;
  const name = process.env.LLM_PROVIDER ?? "anthropic";
  switch (name) {
    case "anthropic":
      provider = new AnthropicProvider();
      break;
    case "mock":
      provider = new MockProvider();
      break;
    default:
      throw new Error(`Unknown LLM_PROVIDER: ${name}`);
  }
  return provider;
}
