# Initialization (init)

The `init` command bootstraps ExplainThisRepo by creating a local, persistent configuration file.

It configures:
- your selected LLM provider
- optional GitHub access (for private repos and higher rate limits)

No repository analysis is performed during initialization.


## What `init` does

- Prompts you to select an LLM provider:

  - Gemini
  - OpenAI
  - Ollama
  - Anthropic
  - Groq
  - OpenRouter

- Collects only the configuration required for that provider

- Optionally prompts for a GitHub token

- Writes a minimal `config.toml` file to the OS-appropriate config directory

- Sets the selected provider as default

- Exits immediately

## GitHub access (optional)

During setup, you can configure a GitHub token.

This enables:

- Access to private repositories
- Higher API rate limits for public repositories

If skipped:
- public repositories still work
- rate limits are lower
- private repositories will fail

## Per provider input

Depending on the provider selected:

### Gemini

- Prompts for `api_key`

### OpenAI

- Prompts for `api_key`

### Ollama

- Prompts for `model` (e.g. `llama3`, `gemma3:4b`, `glm-5:cloud`)
- Prompts for `host` (default: `http://localhost:11434`)

### Anthropic

- Prompts for `api_key`

### Groq

- Prompts for `api_key`
- Prompts for model selection

### OpenRouter

- Prompts for `api_key`
- Prompts for model selection or manual input

Only the selected provider’s configuration is written.

## What `init` does NOT do

- No repository analysis
- No model execution
- No API key validation
- No dependency installation
- No environment variable modification
- No network requests

The configuration is written locally only.

## Input handling

- API keys and tokens are read using hidden terminal input
- Characters are not echoed
- Paste works normally
- Ctrl+C exits cleanly without writing partial state

## Config location

A single authoritative config path is used per OS.

### Windows

`%APPDATA%\ExplainThisRepo\config.toml`

### macOS / Linux

`$XDG_CONFIG_HOME/explainthisrepo/config.toml`

Fallback: `~/.config/explainthisrepo/config.toml`

## Example resulting config

### GitHub token

```toml
[github]
token = "ghp_xxx"
```

### Gemini

```toml
[llm]
provider = "gemini"

[providers.gemini]
api_key = "..."
```

### OpenAI

```
[llm]
provider = "openai"

[providers.openai]
api_key = "..."
```

### Ollama

```
[llm]
provider = "ollama"

[providers.ollama]
model = "llama3"
host = "http://localhost:11434"
```

### Design intent

`init` exists to separate configuration from execution.

After initialization:

- All analysis commands run without repeated prompts

- Provider selection can be overridden via --llm

- GitHub authentication is resolved automatically from config or environment

- Multiple providers can be supported without reinitialization


This establishes a stable foundation for:

- multi-LLM operation

- authenticated GitHub