from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

_MAX_DEFAULT_BYTES = 32_000
_SAMPLE_SIZE = 4_096


@dataclass(frozen=True, slots=True)
class LocalFileReadResult:
    path: str
    name: str
    extension: str
    size_bytes: int
    content: str
    is_text: bool


def _text_ratio(value: str) -> float:
    if not value:
        return 1.0

    visible = 0
    for ch in value:
        if ch.isprintable() or ch in "\n\r\t":
            visible += 1
    return visible / len(value)


def _is_probably_binary(sample: bytes) -> bool:
    if not sample:
        return False

    if sample.startswith(
        (
            b"\xef\xbb\xbf",
            b"\xff\xfe",
            b"\xfe\xff",
            b"\xff\xfe\x00\x00",
            b"\x00\x00\xfe\xff",
        )
    ):
        return False

    if b"\x00" in sample:
        for encoding in (
            "utf-16",
            "utf-16-le",
            "utf-16-be",
            "utf-32",
            "utf-32-le",
            "utf-32-be",
        ):
            try:
                decoded = sample.decode(encoding)
            except UnicodeDecodeError:
                continue
            if _text_ratio(decoded) >= 0.7:
                return False
        return True

    control = 0
    for byte in sample:
        if byte in (9, 10, 13, 12, 8):
            continue
        if byte < 32 or byte == 127:
            control += 1

    return control / len(sample) > 0.3


def _decode_text(raw: bytes) -> str:
    encodings = (
        "utf-8",
        "utf-8-sig",
        "utf-16",
        "utf-16-le",
        "utf-16-be",
        "cp1252",
        "latin-1",
    )

    for encoding in encodings:
        try:
            text = raw.decode(encoding)
        except UnicodeDecodeError:
            continue

        if _text_ratio(text) >= 0.6:
            return text

    raise ValueError("file appears to be binary or uses an unsupported text encoding")


def build_file_read_result(
    *,
    path: str,
    raw: bytes,
    size_bytes: int,
    max_bytes: int = _MAX_DEFAULT_BYTES,
) -> LocalFileReadResult:
    if max_bytes <= 0:
        raise ValueError("max_bytes must be greater than 0")

    bounded = raw[:max_bytes]
    sample = bounded[:_SAMPLE_SIZE]

    if _is_probably_binary(sample):
        raise ValueError("binary files are not supported")

    content = _decode_text(bounded)

    file_path = Path(path)
    return LocalFileReadResult(
        path=path,
        name=file_path.name,
        extension=file_path.suffix.lower().lstrip("."),
        size_bytes=size_bytes,
        content=content,
        is_text=True,
    )


def read_local_file(path: str, max_bytes: int = _MAX_DEFAULT_BYTES) -> LocalFileReadResult:
    if max_bytes <= 0:
        raise ValueError("max_bytes must be greater than 0")

    file_path = Path(path).expanduser()

    if not file_path.exists():
        raise FileNotFoundError(f"No such file: {path}")

    if not file_path.is_file():
        raise ValueError(f"Not a file: {path}")

    try:
        size_bytes = file_path.stat().st_size
        with file_path.open("rb") as handle:
            raw = handle.read(max_bytes)
    except OSError as exc:
        raise OSError(f"Could not read file '{path}': {exc}") from exc

    return build_file_read_result(
        path=str(file_path.resolve()),
        raw=raw,
        size_bytes=size_bytes,
        max_bytes=max_bytes,
    )