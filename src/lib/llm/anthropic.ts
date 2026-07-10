import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import type {
  LLMProvider,
  StructuredRequest,
  StructuredResult,
} from "./types";

const DEFAULT_MODEL = "claude-opus-4-8";

export class AnthropicProvider implements LLMProvider {
  readonly name = "anthropic";
  private client: Anthropic;
  private model: string;

  constructor() {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not set");
    }
    this.client = new Anthropic();
    this.model = process.env.LLM_MODEL ?? DEFAULT_MODEL;
  }

  async generateStructured<T>(
    request: StructuredRequest<T>,
  ): Promise<StructuredResult<T>> {
    const response = await this.client.messages.parse({
      model: this.model,
      max_tokens: request.maxTokens ?? 16000,
      thinking: { type: "adaptive" },
      system: request.system,
      messages: [{ role: "user", content: request.prompt }],
      output_config: { format: zodOutputFormat(request.schema) },
    });

    if (response.stop_reason === "refusal") {
      throw new Error("The model declined to generate this content.");
    }
    if (response.parsed_output == null) {
      throw new Error(
        `Generation did not return valid structured output (stop_reason: ${response.stop_reason})`,
      );
    }

    return {
      data: response.parsed_output,
      model: response.model,
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
    };
  }
}
