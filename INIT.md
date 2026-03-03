# Initialization (init)

The `init` command bootstraps ExplainThisRepo by creating a local, persistent configuration file.

It configures your selected LLM provider once and exits.

And no repository analysis is performed during initialization.


## What `init` does

- Prompts you to select an LLM provider:

  - Gemini
  - OpenAI
  - Ollama

- Collects only the configuration required for that provider

- Writes a minimal `config.toml` file to the OS-appropriate config directory

- Sets the selected provider as default

- Exits immediately


## Per model input

Depending on the provider selected:

### Gemini

- Prompts for `api_key`


### OpenAI

- Prompts for `api_key`


### Ollama

- Prompts for `model` (e.g. `llama3`, `gemma3:4b`, `glm-5:cloud`)

- Prompts for `host` (default: `http://localhost:11434`)

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

- API keys are read using hidden terminal input

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

## Design intent

`init` exists to separate configuration from execution.

After initialization:

- All analysis commands run without repeated prompts

- Provider selection can be overridden via `--llm`

- Multiple providers can be supported without reinitialization

- Configuration remains explicit and local


This establishes a stable foundation for multi-LLM operation.