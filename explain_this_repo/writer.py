from pathlib import Path


def resolve_output_path(output_file: str) -> Path:
    path = Path(output_file)

    if not path.suffix:
        path.mkdir(parents=True, exist_ok=True)
        return path / "EXPLAIN.md"

    path.parent.mkdir(parents=True, exist_ok=True)
    return path


def write_output(content: str, output_file: str = "EXPLAIN.md") -> None:

    output_path = resolve_output_path(output_file)

    output_path.write_text(content, encoding="utf-8")
