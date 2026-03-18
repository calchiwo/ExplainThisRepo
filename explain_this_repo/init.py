import getpass
from typing import Dict

from rich.console import Console

from explain_this_repo.config import write_config

err = Console(stderr=True)


PROVIDERS = {
    "1": "gemini",
    "2": "openai",
    "3": "ollama",
    "4": "anthropic",
    "5": "groq",
    "6": "openrouter",
}


def _prompt_provider() -> str:
    err.print("Select LLM provider:", style="bold")
    err.print("  1) Gemini")
    err.print("  2) OpenAI")
    err.print("  3) Ollama (local)")
    err.print("  4) Anthropic (Claude)")
    err.print("  5) Groq")
    err.print("  6) OpenRouter")

    choice = input("> ").strip()

    provider = PROVIDERS.get(choice)
    if not provider:
        err.print("error: invalid provider selection", style="red")
        raise SystemExit(1)

    return provider


def _prompt_provider_config(provider: str) -> Dict[str, str]:
    if provider == "gemini":
        key = getpass.getpass("Gemini API key: ").strip()
        if not key:
            raise RuntimeError("API key cannot be empty")
        return {"api_key": key}

    if provider == "openai":
        key = getpass.getpass("OpenAI API key: ").strip()
        if not key:
            raise RuntimeError("API key cannot be empty")
        return {"api_key": key}

    if provider == "ollama":
        model = input("Ollama model (e.g. llama3, glm-5:cloud, gemma3:4b): ").strip()
        if not model:
            raise RuntimeError("Model cannot be empty")

        host = (
            input("Ollama host [http://localhost:11434]: ").strip()
            or "http://localhost:11434"
        )

        return {
            "model": model,
            "host": host,
        }

    if provider == "anthropic":
        key = getpass.getpass("Anthropic (Claude) API key: ").strip()
        if not key:
            raise RuntimeError("API key cannot be empty")
        return {"api_key": key}

    if provider == "groq":
        key = getpass.getpass("Groq API key: ").strip()
        if not key:
            raise RuntimeError("API key cannot be empty")

        err.print("Select Groq model:", style="bold")
        err.print("  1) llama3-70b-8192")
        err.print("  2) mixtral-8x7b")
        err.print("  3) deepseek-r1-distill-llama-70b")

        choice = input("> ").strip()

        model_map = {
            "1": "llama3-70b-8192",
            "2": "mixtral-8x7b",
            "3": "deepseek-r1-distill-llama-70b",
        }

        model = model_map.get(choice)
        if not model:
            raise RuntimeError("Invalid model selection")

        return {
            "api_key": key,
            "model": model,
        }

    if provider == "openrouter":
        key = getpass.getpass("OpenRouter API key: ").strip()
        if not key:
            raise RuntimeError("API key cannot be empty")

        err.print("Select OpenRouter model:", style="bold")
        err.print(" 1) openai/gpt-4o (balanced)")
        err.print(" 2) anthropic/claude-3.5-sonnet (reasoning)")
        err.print(" 3) meta-llama/llama-3-70b-instruct (open)")
        err.print(" 4) deepseek/deepseek-chat (cheap/fast)")
        err.print(" 5) Enter model manually")

        choice = input("> ").strip()

        if choice == "5":
            model = input("Enter model (provider/model):").strip()

        model_map = {
            "1": "openai/gpt-4o",
            "2": "anthropic/claude-3.5-sonnet",
            "3": "meta-llama/llama-3-70b-instruct",
            "4": "deepseek/deepseek-chat",
            "5": "",
        }

    raise RuntimeError(f"Unsupported provider: {provider}")


def run_init() -> None:
    err.print(
        "WARNING: input is hidden where applicable. Configuration will be written once.",
        style="yellow",
    )

    try:
        provider = _prompt_provider()
        provider_cfg = _prompt_provider_config(provider)
    except KeyboardInterrupt:
        err.print("\nInterrupted.", style="red")
        raise SystemExit(130)
    except Exception as e:
        err.print(f"error: {e}", style="red")
        raise SystemExit(1)

    lines = [
        "[llm]",
        f'provider = "{provider}"',
        "",
        "[providers.%s]" % provider,
    ]

    for k, v in provider_cfg.items():
        lines.append(f'{k} = "{v}"')

    contents = "\n".join(lines) + "\n"

    write_config(contents)

    err.print("Configuration written.", style="green")
