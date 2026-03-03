import getpass
from typing import Dict

from rich.console import Console

from explain_this_repo.config import write_config

err = Console(stderr=True)


PROVIDERS = {
    "1": "gemini",
    "2": "openai",
    "3": "ollama",
}


def _prompt_provider() -> str:
    err.print("Select LLM provider:", style="bold")
    err.print("  1) Gemini")
    err.print("  2) OpenAI")
    err.print("  3) Ollama (local)")

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
