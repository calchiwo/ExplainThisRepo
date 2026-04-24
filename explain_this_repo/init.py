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
    import sys
    import readchar

    options = [
        "1) Gemini",
        "2) OpenAI",
        "3) Ollama (local or cloud-routed)",
        "4) Anthropic (Claude)",
        "5) Groq",
        "6) OpenRouter",
    ]

    print("Select LLM provider:\n")
    for opt in options:
        print(f"  {opt}")
    print(" > ", end="", flush=True)

    index = None
    total_lines = len(options) + 2

    def move_up(n):
        sys.stdout.write(f"\033[{n}A")

    def move_down(n):
        sys.stdout.write(f"\033[{n}B")

    def clear_line():
        sys.stdout.write("\033[2K\r")

    def draw_option(i, selected):
        move_up(total_lines - i)
        clear_line()
        if selected:
            sys.stdout.write(f"> {options[i]}\n")
        else:
            sys.stdout.write(f"  {options[i]}\n")
        move_down(total_lines - i - 1)
        sys.stdout.flush()

    def draw_prompt(active):
        move_up(1)
        clear_line()
        if active:
            sys.stdout.write(" > ")
        else:
            sys.stdout.write("")
        move_down(1)
        sys.stdout.flush()

    while True:
        key = readchar.readkey()

        if key in (readchar.key.UP, readchar.key.DOWN):
            if index is None:
                index = len(options) - 1 if key == readchar.key.UP else 0
                draw_prompt(False)
                draw_option(index, True)
            else:
                prev = index

                if key == readchar.key.UP:
                    if index == 0:
                        draw_option(index, False)
                        index = None
                        draw_prompt(True)
                        continue
                    index -= 1
                else:
                    if index == len(options) - 1:
                        draw_option(index, False)
                        index = None
                        draw_prompt(True)
                        continue
                    index += 1

                draw_option(prev, False)
                draw_option(index, True)

        elif key == readchar.key.ENTER:
            if index is not None:
                print()
                return PROVIDERS[str(index + 1)]
            else:
                choice = input().strip()
                provider = PROVIDERS.get(choice)
                if not provider:
                    print("error: invalid provider selection")
                    raise SystemExit(1)
                return provider

        elif key.isdigit():
            sys.stdout.write(key)
            sys.stdout.flush()
            choice = key + input().strip()
            provider = PROVIDERS.get(choice)
            if not provider:
                print("error: invalid provider selection")
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
        err.print("  1) openai/gpt-4o (balanced)")
        err.print("  2) anthropic/claude-3.5-sonnet (reasoning)")
        err.print("  3) meta-llama/llama-3-70b-instruct (open)")
        err.print("  4) deepseek/deepseek-chat (cheap/fast)")
        err.print("  5) Enter model manually")

        choice = input("> ").strip()

        model_map = {
            "1": "openai/gpt-4o",
            "2": "anthropic/claude-3.5-sonnet",
            "3": "meta-llama/llama-3-70b-instruct",
            "4": "deepseek/deepseek-chat",
        }

        if choice == "5":
            model = input("Enter model (provider/model): ").strip()
            if not model:
                raise RuntimeError("Model cannot be empty")
        else:
            model = model_map.get(choice)
            if not model:
                raise RuntimeError("Invalid model selection")

        return {
            "api_key": key,
            "model": model,
        }

    raise RuntimeError(f"Unsupported provider: {provider}")


def _prompt_github_token() -> Dict[str, str]:
    err.print(
        "\nConfigure GitHub access for private repos and higher rate limits:",
        style="cyan",
    )
    token = getpass.getpass("GitHub token (leave empty to skip): ").strip()
    if not token:
        return {}
    return {"token": token}


def run_init() -> None:
    err.print(
        "WARNING: input is hidden where applicable. Configuration will be written once.",
        style="yellow",
    )

    try:
        provider = _prompt_provider()
        provider_cfg = _prompt_provider_config(provider)
        github_cfg = _prompt_github_token()
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
        f"[providers.{provider}]",
    ]

    for k, v in provider_cfg.items():
        lines.append(f'{k} = "{v}"')

    if github_cfg:
        lines.extend(
            [
                "",
                "[github]",
            ]
        )
        for k, v in github_cfg.items():
            lines.append(f'{k} = "{v}"')

    contents = "\n".join(lines) + "\n"

    write_config(contents)

    err.print("Configuration written.", style="green")
