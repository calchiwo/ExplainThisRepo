import { LLMProvider, LLMProviderError } from "./base.js"

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

    this.model = config.model as string
    this.host = (config.host ?? DEFAULT_HOST).replace(/\/$/, "")

    this.validateConfig()
  }

  validateConfig(): void {

    if (!this.model || !String(this.model).trim()) {
      throw new LLMProviderError(
        "Ollama provider requires a model.\n" +
        "Set providers.ollama.model (e.g. llama3, gemma3:4b, glm-5:cloud)."
      )
    }

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

    } catch (err: any) {
      results.push(`Ollama server not reachable: ${String(err?.message ?? err)}`)
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

    let res: Response

    try {
      res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })
    } catch (err: any) {
      throw new LLMProviderError(
        [
          "Failed to connect to Ollama.",
          "Ensure Ollama is running locally.",
          "Start it with: ollama serve",
          `Error: ${String(err?.message ?? err)}`
        ].join("\n")
      )
    }

    if (!res.ok) {
      throw new LLMProviderError(
        `Ollama HTTP error: ${res.status}`
      )
    }

    let data: any

    try {
      data = await res.json()
    } catch {
      throw new LLMProviderError("Invalid response from Ollama")
    }

    const text = data?.response

    if (!text || !String(text).trim()) {
      throw new LLMProviderError("Ollama returned no text")
    }

    return String(text).trim()
  }
}