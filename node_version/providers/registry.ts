import { loadConfig } from "../config.js"
import { LLMProvider, LLMProviderError } from "./base.js"

import { GeminiProvider } from "./gemini.js"
import { OpenAIProvider } from "./openai.js"
import { OllamaProvider } from "./ollama.js"

type ProviderConstructor = new (config?: any) => LLMProvider

const PROVIDER_REGISTRY: Record<string, ProviderConstructor> = {
  gemini: GeminiProvider,
  openai: OpenAIProvider,
  ollama: OllamaProvider,
}

export function listProviders(): string[] {
  return Object.keys(PROVIDER_REGISTRY)
}

export function getProvider(name: string): LLMProvider {

  const providerName = name.toLowerCase()

  const Provider = PROVIDER_REGISTRY[providerName]

  if (!Provider) {
    throw new LLMProviderError(`Unknown LLM provider '${providerName}'`)
  }

  const config = loadConfig()

  const providerConfig =
    config?.providers?.[providerName] ?? {}

  return new Provider(providerConfig)
}

export function getActiveProvider(
  override?: string
): LLMProvider {

  if (override) {
    return getProvider(override)
  }

  const config = loadConfig()

  const defaultProvider =
    config?.llm?.provider

  if (!defaultProvider) {
    throw new LLMProviderError(
      "No LLM provider configured. Run 'explainthisrepo init'."
    )
  }

  return getProvider(defaultProvider)
}