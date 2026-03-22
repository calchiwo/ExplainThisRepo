import { LLMProvider, LLMProviderError } from "./base.js"

const DEFAULT_MODEL = "claude-3-5-sonnet-20241022"

type AnthropicConfig = {
  api_key?: string
  model?: string
}

export class AnthropicProvider implements LLMProvider {

  name = "anthropic"

  private apiKey: string
  private model: string
  private client: any | null = null

  constructor(config: AnthropicConfig = {}) {
    this.apiKey = config.api_key ?? ""
    this.model = config.model ?? DEFAULT_MODEL

    this.validateConfig()
  }

  validateConfig(): void {
    if (!this.apiKey || !this.apiKey.trim()) {
      throw new LLMProviderError(
        "Anthropic provider requires an API key.\n" +
        "Run `explainthisrepo init` or set providers.anthropic.api_key."
      )
    }
  }

  private getClient() {
    if (this.client) {
      return this.client
    }

    try {
      // dynamic import to match Python lazy import behavior
      const { default: Anthropic } = require("@anthropic-ai/sdk")
      this.client = new Anthropic({ apiKey: this.apiKey })
      return this.client
    } catch (err: any) {
      throw new LLMProviderError(
        "Anthropic support is not installed.\n" +
        "Install it with:\n" +
        '  npm install @anthropic-ai/sdk'
      )
    }
  }

  async generate(prompt: string): Promise<string> {
    const client = this.getClient()

    let response: any

    try {
      response = await client.messages.create({
        model: this.model,
        max_tokens: 1024,
        messages: [
          { role: "user", content: prompt }
        ]
      })
    } catch (err: any) {
      const message = err?.message ? String(err.message) : String(err)
      throw new LLMProviderError(`Anthropic request failed: ${message}`)
    }

    let text: string | null = null

    try {
      text = response?.content?.[0]?.text ?? null
    } catch {
      text = null
    }

    if (!text || !text.trim()) {
      throw new LLMProviderError("Anthropic returned no text")
    }

    return text.trim()
  }

  async doctor(): Promise<string[]> {
    return [
      `ANTHROPIC_API_KEY set: ${Boolean(this.apiKey)}`,
      `model: ${this.model}`,
    ]
  }
}