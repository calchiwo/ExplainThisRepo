import { GoogleGenerativeAI } from "@google/generative-ai"

import { LLMProvider, LLMProviderError } from "./base"

const DEFAULT_MODEL = "gemini-2.5-flash-lite"

type GeminiConfig = {
  api_key?: string
  model?: string
}

export class GeminiProvider implements LLMProvider {

  name = "gemini"

  private apiKey?: string
  private model: string
  private client?: GoogleGenerativeAI

  constructor(config: GeminiConfig = {}) {
    this.apiKey = config.api_key
    this.model = config.model ?? DEFAULT_MODEL

    this.validateConfig()
  }

  validateConfig(): void {

    if (!this.apiKey || !this.apiKey.trim()) {
      throw new LLMProviderError(
        [
          "Gemini provider requires an API key.",
          "Run `explainthisrepo init` to configure it."
        ].join("\n")
      )
    }

  }

  private getClient(): GoogleGenerativeAI {

    if (this.client) {
      return this.client
    }

    this.client = new GoogleGenerativeAI(this.apiKey!)
    return this.client
  }

  async generate(prompt: string): Promise<string> {

    const genAI = this.getClient()

    const model = genAI.getGenerativeModel({
      model: this.model
    })

    try {

      const result = await model.generateContent(prompt)

      const text = result?.response?.text?.() ?? ""

      if (!text.trim()) {
        throw new LLMProviderError("Gemini returned no text")
      }

      return text.trim()

    } catch (err: any) {

      const message =
        err?.message ? String(err.message) : String(err)

      throw new LLMProviderError(
        `Gemini request failed: ${message}`
      )
    }
  }
}