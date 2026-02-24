import getpass
import sys

from rich.console import Console

from explain_this_repo.config import get_config_path, write_config

console = Console()

CONFIG_TEMPLATE = """[llm]
provider = "gemini"
api_key = "{api_key}"
"""


def run_init() -> None:
    console.print(
        "warning: input is hidden. Paste your GEMINI_API_KEY and press Enter.",
        style="yellow",
        stderr=True,
    )

    try:
        api_key = getpass.getpass("Gemini API key: ").strip()
    except KeyboardInterrupt:
        console.print("\nInterrupted.", style="red", stderr=True)
        raise SystemExit(130)

    if not api_key:
        console.print("error: API key cannot be empty", style="red", stderr=True)
        raise SystemExit(1)

    config_text = CONFIG_TEMPLATE.format(api_key=api_key)
    write_config(config_text)

    config_path = get_config_path()

    console.print("Configuration written.", style="green", stderr=True)
    console.print(f"Config path: {config_path}", style="dim", stderr=True)
    console.print(
        "Next: run explainthisrepo <owner/repo>",
        style="cyan",
        stderr=True,
    )
