import { LLMProvider, LLMProviderError } from "./base.js"

const DEFAULT_MODEL = "llama3"
const DEFAULT_HOST = "http://localhost:11434"

type OllamaConfig = {
  model?: string
  host?: string
}

export class OllamaProvider implements LLMProvider {

  name = "ollama"

  private model: string
  private host: string

  constructor(config: OllamaConfig = {}) {

    this.model = config.model ?? DEFAULT_MODEL
    this.host = (config.host ?? DEFAULT_HOST).replace(/\/$/, "")

    this.validateConfig()

  }

  validateConfig(): void {

    if (!this.host.startsWith("http")) {
      throw new LLMProviderError(
        "Ollama host must be a valid URL (e.g. http://localhost:11434)"
      )
    }

  }

  async doctor(): Promise<string[]> {

    const results: string[] = []

    try {

      const res = await fetch(`${this.host}/api/tags`, {
        method: "GET"
      })

      if (res.ok) {
        results.push("Ollama server reachable")
      } else {
        results.push(`Ollama server responded with ${res.status}`)
      }

    } catch {
      results.push("Ollama server not reachable")
    }

    results.push(`model: ${this.model}`)
    results.push(`host: ${this.host}`)

    return results
  }

  async generate(prompt: string): Promise<string> {

    const url = `${this.host}/api/generate`

    const payload = {
      model: this.model,
      prompt,
      stream: false
    }

    try {

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        throw new LLMProviderError(
          `Ollama server responded with ${res.status}`
        )
      }

      const data = await res.json()

      const text = data?.response ?? ""

      if (!text.trim()) {
        throw new LLMProviderError("Ollama returned no text")
      }

      return text.trim()

    } catch (err: any) {

      const message =
        err?.message ? String(err.message) : String(err)

      throw new LLMProviderError(
        [
          "Failed to connect to Ollama.",
          "Ensure Ollama is running locally.",
          "Start it with: ollama serve",
          `Error: ${message}`
        ].join("\n")
      )
    }

  }

}