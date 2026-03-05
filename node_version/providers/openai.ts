import OpenAI from "openai"

import { LLMProvider, LLMProviderError } from "./base.js"

const DEFAULT_MODEL = "gpt-4o-mini"

type OpenAIConfig = {
  api_key?: string
  model?: string
}

export class OpenAIProvider implements LLMProvider {

  name = "openai"

  private apiKey?: string
  private model: string
  private client?: OpenAI

  constructor(config: OpenAIConfig = {}) {
    this.apiKey = config.api_key
    this.model = config.model ?? DEFAULT_MODEL

    this.validateConfig()
  }

  validateConfig(): void {

    if (!this.apiKey || !this.apiKey.trim()) {
      throw new LLMProviderError(
        [
          "OpenAI provider requires an API key.",
          "Run `explainthisrepo init` to configure it."
        ].join("\n")
      )
    }

  }

  private getClient(): OpenAI {

    if (this.client) {
      return this.client
    }

    this.client = new OpenAI({
      apiKey: this.apiKey!
    })

    return this.client
  }

  async generate(prompt: string): Promise<string> {

    const client = this.getClient()

    try {

      const response = await client.chat.completions.create({
        model: this.model,
        messages: [
          { role: "user", content: prompt }
        ]
      })

      const text =
        response?.choices?.[0]?.message?.content ?? ""

      if (!text.trim()) {
        throw new LLMProviderError(
          "OpenAI returned no text"
        )
      }

      return text.trim()

    } catch (err: any) {

      const message =
        err?.message ? String(err.message) : String(err)

      throw new LLMProviderError(
        `OpenAI request failed: ${message}`
      )
    }
  }

  doctor(): string[] {
    return [
      `OPENAI_API_KEY set: ${Boolean(this.apiKey)}`,
      `model: ${this.model}`
    ]
  }

}