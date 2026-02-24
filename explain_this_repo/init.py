import getpass
import sys

from explain_this_repo.config import write_config

CONFIG_TEMPLATE = """[llm]
provider = "gemini"
api_key = "{api_key}"
"""


def run_init() -> None:
    print(
        "warning: input is hidden. Paste your GEMINI_API_KEY and press Enter.",
        file=sys.stderr,
    )

    try:
        api_key = getpass.getpass("Gemini API key: ").strip()
    except KeyboardInterrupt:
        print("\nInterrupted.", file=sys.stderr)
        raise SystemExit(130)

    if not api_key:
        print("error: API key cannot be empty", file=sys.stderr)
        raise SystemExit(1)

    config_text = CONFIG_TEMPLATE.format(api_key=api_key)

    write_config(config_text)

    print("Configuration written.", file=sys.stderr)
