import { LLMProvider, LLMProviderError } from "./base.js";

const BASE_URL = "https://openrouter.ai/api/v1";

type OpenRouterConfig = {
  api_key?: string;
  model?: string;
};

export class OpenRouterProvider implements LLMProvider {
  name = "openrouter";

  private apiKey: string;
  private model: string;
  private client: any | null = null;

  constructor(config: OpenRouterConfig = {}) {
    this.apiKey = config.api_key ?? "";
    this.model = config.model as string;

    this.validateConfig();
  }

  validateConfig(): void {
    if (!this.apiKey || !this.apiKey.trim()) {
      throw new LLMProviderError(
        "OpenRouter provider requires an API key.\n" +
          "Run `explainthisrepo init` or set providers.openrouter.api_key.",
      );
    }

    if (!this.model || !String(this.model).trim()) {
      throw new LLMProviderError(
        "OpenRouter provider requires a model.\n" +
          "Set providers.openrouter.model (e.g. openai/gpt-4o, deepseek/deepseek-chat).",
      );
    }
  }

  private getClient() {
    if (this.client) {
      return this.client;
    }

    try {
      const { OpenAI } = require("openai");

      this.client = new OpenAI({
        apiKey: this.apiKey,
        baseURL: BASE_URL,
      });

      return this.client;
    } catch {
      throw new LLMProviderError(
        "OpenRouter support is not installed.\n" +
          "Install it with:\n" +
          "  npm install openai",
      );
    }
  }

  async generate(prompt: string): Promise<string> {
    const client = this.getClient();

    let response: any;

    try {
      response = await client.chat.completions.create({
        model: this.model,
        messages: [{ role: "user", content: prompt }],
      });
    } catch (err: any) {
      const message = err?.message ? String(err.message) : String(err);
      throw new LLMProviderError(`OpenRouter request failed: ${message}`);
    }

    let text: string | null = null;

    try {
      text = response?.choices?.[0]?.message?.content ?? null;
    } catch {
      text = null;
    }

    if (!text || !text.trim()) {
      throw new LLMProviderError("OpenRouter returned no text");
    }

    return text.trim();
  }

  async doctor(): Promise<string[]> {
    return [
      `OPENROUTER_API_KEY set: ${Boolean(this.apiKey)}`,
      `model: ${this.model}`,
    ];
  }
}
