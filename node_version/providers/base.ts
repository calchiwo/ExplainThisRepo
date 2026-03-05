export class LLMProviderError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "LLMProviderError"
  }
}

export interface LLMProvider {

  name: string

  validateConfig(): void

  generate(prompt: string): Promise<string>
}