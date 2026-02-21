import os
from dataclasses import dataclass


@dataclass
class LocalReadResult:
    tree: list[str]
    tree_text: str
    key_files: dict[str, str]
    files_text: str


_KEY_FILENAMES = {
    "readme.md", "readme.txt", "readme.rst", "readme",
    "package.json", "pyproject.toml", "setup.py", "setup.cfg",
    "requirements.txt", "cargo.toml", "go.mod", "pom.xml",
    "build.gradle", "composer.json", "gemfile", "makefile",
    "dockerfile", "docker-compose.yml", "docker-compose.yaml",
    ".env.example", "tsconfig.json", "angular.json", "next.config.js",
    "vite.config.js", "vite.config.ts", "webpack.config.js",
}

_SKIP_DIRS = {
    ".git", ".hg", ".svn", "node_modules", "__pycache__",
    ".venv", "venv", "env", ".env", "dist", "build",
    ".idea", ".vscode", ".mypy_cache", ".pytest_cache",
    "coverage", ".coverage", "htmlcov",
}

_MAX_FILE_BYTES = 32_000
_MAX_KEY_FILES = 12


def read_local_repo_signal_files(path: str) -> LocalReadResult:
    root = os.path.abspath(path)
    tree_lines: list[str] = []
    key_files: dict[str, str] = {}

    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = sorted(d for d in dirnames if d not in _SKIP_DIRS)

        rel_dir = os.path.relpath(dirpath, root)
        prefix = "" if rel_dir == "." else rel_dir + "/"

        for filename in sorted(filenames):
            rel_path = prefix + filename
            tree_lines.append(rel_path)

            if filename.lower() in _KEY_FILENAMES and len(key_files) < _MAX_KEY_FILES:
                full_path = os.path.join(dirpath, filename)
                try:
                    with open(full_path, "r", encoding="utf-8", errors="replace") as f:
                        content = f.read(_MAX_FILE_BYTES)
                    key_files[rel_path] = content
                except OSError:
                    pass

    tree_text = "\n".join(tree_lines)

    files_parts = []
    for rel_path, content in key_files.items():
        files_parts.append(f"### {rel_path}\n{content}")
    files_text = "\n\n".join(files_parts)

    return LocalReadResult(
        tree=tree_lines,
        tree_text=tree_text,
        key_files=key_files,
        files_text=files_text,
    )