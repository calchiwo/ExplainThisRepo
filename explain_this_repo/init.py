import getpass
import sys

from rich.console import Console

from explain_this_repo.config import get_config_path, write_config

err_console = Console(stderr=True)

CONFIG_TEMPLATE = """[llm]
provider = "gemini"
api_key = "{api_key}"
"""


def run_init() -> None:
    err_console.print(
        "WARNING: input is hidden. Paste your GEMINI_API_KEY and press Enter.",
        style="yellow",
    )

    try:
        api_key = getpass.getpass("Gemini API key: ").strip()
    except KeyboardInterrupt:
        err_console.print("\nInterrupted.", style="red")
        raise SystemExit(130)

    if not api_key:
        err_console.print("error: API key cannot be empty", style="red")
        raise SystemExit(1)

    write_config(CONFIG_TEMPLATE.format(api_key=api_key))

    err_console.print("Configuration written.", style="green")
