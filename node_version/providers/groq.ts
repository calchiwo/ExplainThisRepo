import { LLMProvider, LLMProviderError } from "./base.js"

type GroqConfig = {
  api_key?: string
  model?: string
}

export class GroqProvider implements LLMProvider {

  name = "groq"

  private apiKey: string
  private model: string
  private client: any | null = null

  constructor(config: GroqConfig = {}) {
    this.apiKey = config.api_key ?? ""
    this.model = config.model as string

    this.validateConfig()
  }

  validateConfig(): void {

    if (!this.apiKey || !this.apiKey.trim()) {
      throw new LLMProviderError(
        "Groq provider requires an API key.\n" +
        "Run `explainthisrepo init` or set providers.groq.api_key."
      )
    }

    if (!this.model || !String(this.model).trim()) {
      throw new LLMProviderError(
        "Groq provider requires a model.\n" +
        "Set providers.groq.model (e.g. llama3-70b-8192, mixtral-8x7b, deepseek-r1-distill-llama-70b)."
      )
    }
  }

  private getClient() {
    if (this.client) {
      return this.client
    }

    try {
      const Groq = require("groq")
      this.client = new Groq({ apiKey: this.apiKey })
      return this.client
    } catch {
      throw new LLMProviderError(
        "Groq support is not installed.\n" +
        "Install it with:\n" +
        "  npm install groq"
      )
    }
  }

  async generate(prompt: string): Promise<string> {

    const client = this.getClient()

    let response: any

    try {
      response = await client.chat.completions.create({
        model: this.model,
        messages: [
          { role: "user", content: prompt }
        ]
      })
    } catch (err: any) {
      const message = err?.message ? String(err.message) : String(err)
      throw new LLMProviderError(`Groq request failed: ${message}`)
    }

    let text: string | null = null

    try {
      text = response?.choices?.[0]?.message?.content ?? null
    } catch {
      text = null
    }

    if (!text || !text.trim()) {
      throw new LLMProviderError("Groq returned no text")
    }

    return text.trim()
  }

  async doctor(): Promise<string[]> {
    return [
      `GROQ_API_KEY set: ${Boolean(this.apiKey)}`,
      `model: ${this.model}`,
    ]
  }
}