# `node_version/providers`

LLM provider implementations for the Node CLI.

This module implements the provider layer used by the Node version of ExplainThisRepo.
It allows the CLI to support multiple model backends without coupling core logic to any specific SDK.

All model interaction is routed through this layer.


---

# Overview

The Node CLI is designed to be model-agnostic.

Core modules such as:

- CLI argument handling

- prompt construction

- repository analysis


do not interact with any LLM SDK directly.

Instead, they delegate generation to a provider resolved at runtime.


---

# Architecture
```
providers/
│
├── base.ts        # Provider interface + error types
├── registry.ts    # Provider resolution
│
├── gemini.ts      # Gemini implementation
├── openai.ts      # OpenAI implementation
└── ollama.ts      # Ollama implementation
```

Each provider implements the same interface defined in base.ts.


---

# Provider Contract

All providers implement the `LLMProvider` interface.

```typescript
export interface LLMProvider {
  name: string

  generate(prompt: string): Promise<string>

  doctor?(): Promise<boolean | string[] | void>
}
```

Providers may also throw `LLMProviderError` for user-facing failures.


---

# Responsibilities

### generate(prompt)

Executes a model request and returns generated text.

Providers are responsible for:

- initializing SDK clients

- making API calls

- handling vendor-specific behavior

- translating errors into readable messages


The function must return a non-empty string.


---

### doctor()

Optional diagnostics hook used by:

```bash
explainthisrepo --doctor
```

Providers can implement checks such as:

- API key presence

- endpoint reachability

- model configuration


Return types:
```typescript
true
false
string[]
```

If not implemented, the CLI will skip provider diagnostics.


---

# Provider Registry

Provider resolution is handled by registry.ts.

Responsibilities:

- mapping provider names to constructors

- loading configuration

- resolving the active provider


Example:

```typescript
const PROVIDER_REGISTRY = {
  gemini: GeminiProvider,
  openai: OpenAIProvider,
  ollama: OllamaProvider,
}
```

Resolution flow:

```
CLI
  ↓
generate()
  ↓
getActiveProvider()
  ↓
provider.generate()
```

---

# Configuration

Configuration is loaded from config.toml.

Parsed via:
```
loadConfig()
```

Example:
```
[llm]
provider = "openai"

[providers.openai]
api_key = "..."

[providers.ollama]
model = "llama3"
host = "http://localhost:11434"
```

Providers receive their scoped configuration at construction time.


---

# Runtime Provider Selection

The active provider can be overridden per command:
```
explainthisrepo owner/repo --llm openai
explainthisrepo owner/repo --llm gemini
explainthisrepo owner/repo --llm ollama
```
Resolution priority:

1. --llm flag


2. config default



---

# Dependency Model

Unlike Python, the Node CLI does not use optional extras.

Provider dependencies are installed through npm.

Example:
```
npm install
```
Each provider imports its SDK directly.

Missing dependencies should be handled inside the provider and surfaced as errors.


---

# Adding a New Provider

## 1. Implement provider

Create:

```
providers/myprovider.ts
```

Example:
```typescript
import { LLMProvider } from "./base.js"

export class MyProvider implements LLMProvider {
  name = "myprovider"

  async generate(prompt: string): Promise<string> {
    // implement request
    return "..."
  }

  async doctor(): Promise<string[]> {
    return ["ok"]
  }
}
```

---

## 2. Register provider

Add to registry:
```
PROVIDER_REGISTRY["myprovider"] = MyProvider
```

---

## 3. Support configuration

Ensure config is read from:
```
config.providers.myprovider
```

---

# Design Constraints

## CLI must remain provider-agnostic

No SDK logic should appear in:

```
cli.ts
generate.ts
prompt.ts
repo_reader.ts
```

All model interaction belongs in providers.


---

# Providers own side effects

Providers handle:

- network calls

- SDK initialization

- retries and failures

- diagnostics


---

Async boundary is enforced

All provider calls are asynchronous.

The rest of the system should treat providers as:

```
await provider.generate(prompt)
```

No synchronous assumptions should exist.


---

# Registry is the only entry point

Core modules must never instantiate providers directly.

Always use:

```
getActiveProvider()
```

---

# Why This Exists

This architecture allows:

- multiple model backends

- runtime switching

- isolated vendor integrations

- consistent CLI behavior across providers


It ensures the CLI can evolve without depending on any specific LLM vendor.


---

# Current Providers

- gemini
- openai
- ollama

Additional providers can be added without modifying core modules.


---

# Summary

The provider layer isolates all model interaction behind a shared interface.

This keeps the Node CLI:

- extensible
- predictable
- vendor-agnostic

All future model integrations should be implemented within this directory.