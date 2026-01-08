from pathlib import Path


def write_output(content: str) -> None:
    output_path = Path.cwd() / "EXPLAIN.md"
    output_path.write_text(content, encoding="utf-8")
