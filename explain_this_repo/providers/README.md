# `explain_this_repo/providers`

Provider implementations for ExplainThisRepo.

This module implements the **LLM provider architecture** used by the CLI.
It allows ExplainThisRepo to support multiple language model backends without coupling the core CLI to any specific vendor SDK.

The CLI is **model-agnostic**. All model interaction happens through this provider layer.

---

# Overview

ExplainThisRepo previously relied on a **single hard-coded model provider (Gemini)**.

The provider system introduces a **pluggable architecture** that separates:

```
CLI logic
prompt generation
repository analysis
```

from

```
model providers
vendor SDKs
API configuration
diagnostics
```

The result is a clean separation of concerns.

---

# Architecture

The provider system consists of four components:

```
providers/
│
├── base.py        # Provider interface
├── registry.py    # Provider resolution
│
├── gemini.py      # Gemini implementation
├── openai.py      # OpenAI implementation
└── ollama.py      # Ollama implementation
```

Each provider implements the same interface defined in `base.py`.

---

# Provider Contract

All providers must implement the `LLMProvider` interface.

```python
class LLMProvider(ABC):

    name: str

    def validate_config(self) -> None:
        ...

    def generate(self, prompt: str) -> str:
        ...

    def doctor(self) -> list[str] | bool:
        ...
```

## Responsibilities

### `validate_config()`

Ensures required configuration values exist.

Examples:

* API keys
* model name
* server host

This method should fail early if configuration is invalid.

---

### `generate(prompt)`

Executes the model request and returns the generated text.

Providers are responsible for:

* constructing the API request
* handling vendor SDK behavior
* translating API errors
* ensuring text output exists

The CLI expects this method to return **a non-empty string**.

---

### `doctor()`

Runs provider diagnostics.

This method is used by:

```
explainthisrepo --doctor
```

Providers can implement checks such as:

* API key presence
* server connectivity
* model availability

Return value may be:

```
True
False
list[str]
```

---

# Provider Registry

Provider resolution is handled by `registry.py`.

The registry is responsible for:

* mapping provider names to implementations
* loading provider configuration
* selecting the active provider

Example registry mapping:

```python
_PROVIDER_REGISTRY = {
    "gemini": "explain_this_repo.providers.gemini.GeminiProvider",
    "openai": "explain_this_repo.providers.openai.OpenAIProvider",
    "ollama": "explain_this_repo.providers.ollama.OllamaProvider",
}
```

The active provider is determined by:

1. `--llm` runtime flag
2. configuration default

Resolution flow:

```
CLI
  ↓
generate()
  ↓
registry.get_active_provider()
  ↓
provider.generate()
```

---

# Configuration

Provider configuration is stored in `config.toml`.

Example for Gemini:

```bash
[llm]
provider = "gemini"

[providers.gemini]
api_key = "..."
```
Example for OpenAI:

```bash
[llm]
provider = "openai"

[providers.gemini]
api_key = "..."
```

Example for Ollama:

```bash
[llm]
provider = "ollama"

[providers.ollama]
model = "llama3"
host = "http://localhost:11434"
```

Only the selected provider is used during execution.

---

# Runtime Provider Selection

Users can override the configured provider:

```
explainthisrepo owner/repo --llm gemini
explainthisrepo owner/repo --llm openai
explainthisrepo owner/repo --llm ollama
```

This override is resolved by the provider registry.

---

# Optional Dependencies

Some providers require additional SDK dependencies.

Example:

```
pip install explainthisrepo[gemini]
pip install explainthisrepo[openai]
```

Ollama uses HTTP and does not require additional Python dependencies.

---

# Adding a New Provider

To add a new provider:

### 1. Implement the provider

Create:

```
providers/myprovider.py
```

Example:

```python
from explain_this_repo.providers.base import LLMProvider


class MyProvider(LLMProvider):

    name = "myprovider"

    def validate_config(self):
        ...

    def generate(self, prompt: str) -> str:
        ...

    def doctor(self):
        ...
```

---

### 2. Register the provider

Add it to the registry:

```python
_PROVIDER_REGISTRY["myprovider"] = "explain_this_repo.providers.myprovider.MyProvider"
```

---

### 3. Update configuration

Add provider configuration support to `init.py`.

---

# Design Principles

The provider architecture follows several rules:

### CLI must remain vendor-agnostic

No vendor SDK logic should appear in:

```
cli.py
generate.py
prompt.py
repo_reader.py
```

All vendor interaction belongs inside providers.

---

### Providers own SDK logic

Providers are responsible for:

* initializing SDK clients
* formatting requests
* handling API errors
* running diagnostics

---

### Core modules remain stable

The core CLI should not change when new providers are added.

Only the provider layer expands.

---

# Why This Architecture Exists

This system enables:

• support for multiple LLM vendors
• runtime model selection
• isolated vendor integrations
• easier testing
• future provider expansion

The CLI can now evolve independently of any specific model provider.

---

# Current Providers

ExplainThisRepo currently supports:

```
Gemini
OpenAI
Ollama
```

Additional providers can be added without modifying the CLI core.

---

# Summary

The provider system isolates model interaction from the rest of the application.

This keeps the CLI:

```
stable
extensible
vendor-agnostic
```

All future model integrations should be implemented inside this module.

For more details about how initilization works, see also [INIT.md](https://github.com/calchiwo/ExplainThisRepo/blob/main/INIT.md)