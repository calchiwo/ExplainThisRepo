from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from explain_this_repo.github import fetch_tree, fetch_file


@dataclass
class ReadResult:
    tree_text: str
    files_text: str


# Hard limits (keep it fast + cheap)
MAX_FILES = 20
MAX_TOTAL_CHARS = 150_000
MAX_FILE_CHARS = 8000


def _is_noise_file(path: str) -> bool:
    p = path.lower()
    if p.endswith((".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico", ".webp")):
        return True
    if p.endswith((".mp4", ".mov", ".avi", ".mkv")):
        return True
    if p.endswith((".zip", ".tar", ".gz", ".7z", ".rar")):
        return True
    if p.endswith((".lock", ".min.js", ".min.css")):
        return True
    if "/dist/" in f"/{p}/" or "/build/" in f"/{p}/" or "/.git/" in f"/{p}/":
        return True
    if p.startswith("dist/") or p.startswith("build/"):
        return True
    return False


def _score_path(path: str) -> int:
    """
    Higher score = more important.
    Keep this simple, no overengineering.
    """
    p = path.lower()

    # identity files
    if p in {"package.json", "pyproject.toml", "requirements.txt", "setup.py"}:
        return 100
    if p in {"readme.md", "readme"}:
        return 90

    # entrypoints
    if p.endswith(("main.py", "__main__.py", "cli.py", "cli.ts", "cli.js")):
        return 85
    if p.endswith(("index.js", "index.ts", "app.js", "app.ts", "server.js", "server.ts")):
        return 80

    # backend / config
    if p in {"dockerfile", "compose.yml", "docker-compose.yml"}:
        return 75
    if p.endswith(("tsconfig.json", "vite.config.ts", "next.config.js", "vercel.json")):
        return 70

    # common code folders
    if p.startswith(("src/", "app/", "apps/", "packages/", "lib/", "api/")):
        return 60

    # tests might still be signal
    if p.startswith(("tests/", "test/")):
        return 40

    return 10


def _render_tree(tree: list[dict[str, Any]], max_lines: int = 160) -> str:
    """
    Compact tree view: list paths only.
    """
    paths = []
    for item in tree:
        if item.get("type") != "blob":
            continue
        path = item.get("path")
        if not path:
            continue
        if _is_noise_file(path):
            continue
        paths.append(path)

    paths = sorted(paths)[:max_lines]
    if not paths:
        return "No tree provided"

    return "\n".join(paths)


def _pick_signal_files(tree: list[dict[str, Any]]) -> list[str]:
    candidates = []
    for item in tree:
        if item.get("type") != "blob":
            continue
        path = item.get("path")
        if not path:
            continue
        if _is_noise_file(path):
            continue
        candidates.append(path)

    # prioritize
    candidates.sort(key=_score_path, reverse=True)

    picked = []
    seen = set()
    for p in candidates:
        if p in seen:
            continue
        seen.add(p)
        picked.append(p)
        if len(picked) >= MAX_FILES:
            break

    return picked


def _format_files_snippets(snips: list[tuple[str, str]]) -> str:
    if not snips:
        return "No code files provided"

    out = []
    for path, content in snips:
        out.append(f"\n=== {path} ===\n{content.strip()}\n")
    return "\n".join(out).strip()


def read_repo_signal_files(owner: str, repo: str) -> ReadResult:
    tree = fetch_tree(owner, repo)

    tree_text = _render_tree(tree)

    picked = _pick_signal_files(tree)

    total = 0
    snippets: list[tuple[str, str]] = []

    for p in picked:
        if total >= MAX_TOTAL_CHARS:
            break

        content = fetch_file(owner, repo, p)
        if not content:
            continue

        snippet = content[:MAX_FILE_CHARS]
        total += len(snippet)
        snippets.append((p, snippet))

        if len(snippets) >= MAX_FILES:
            break

    files_text = _format_files_snippets(snippets)

    return ReadResult(tree_text=tree_text, files_text=files_text)