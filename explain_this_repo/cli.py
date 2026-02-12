import argparse
import os
import platform
import sys
import urllib.request
from importlib.metadata import PackageNotFoundError, version
from urllib.parse import urlparse

from explain_this_repo.generate import generate_explanation
from explain_this_repo.github import fetch_languages, fetch_readme, fetch_repo
from explain_this_repo.prompt import (build_prompt, build_quick_prompt,
                                      build_simple_prompt)
from explain_this_repo.repo_reader import read_repo_signal_files
from explain_this_repo.stack_detector import detect_stack
from explain_this_repo.stack_printer import print_stack
from explain_this_repo.writer import write_output


def resolve_repo_target(target: str) -> tuple[str, str]:
    target = target.strip()

    # Fix common scheme typos
    if target.startswith("https//"):
        target = target.replace("https//", "https://", 1)
    if target.startswith("http//"):
        target = target.replace("http//", "http://", 1)

    # Case 1: SSH clone URL
    # git@github.com:owner/repo.git
    if target.startswith("git@github.com:"):
        path = target.replace("git@github.com:", "", 1)
        if "/" not in path:
            raise ValueError("Invalid GitHub SSH repository URL")
        owner, repo = path.split("/", 1)
        return owner, repo.removesuffix(".git")

    # Case 2: github.com/owner/repo
    if target.startswith("github.com/"):
        target = "https://" + target

    # Case 3: Full HTTP(S) GitHub URL
    if target.startswith("http://") or target.startswith("https://"):
        parsed = urlparse(target)

        if parsed.netloc.lower() not in {"github.com", "www.github.com"}:
            raise ValueError("Only GitHub repository URLs are supported")

        clean_path = parsed.path.split("?")[0].split("#")[0]
        parts = [p for p in clean_path.split("/") if p]

        if len(parts) < 2:
            raise ValueError("URL must point to a repository, not a GitHub page")

        owner = parts[0]
        repo = parts[1].removesuffix(".git")
        return owner, repo

    # Case 4: owner/repo
    if target.count("/") == 1:
        owner, repo = target.split("/")
        if owner and repo:
            return owner, repo

    raise ValueError("Invalid format. Use owner/repo or a GitHub repo URL")


def _pkg_version(name: str) -> str:
    try:
        return version(name)
    except PackageNotFoundError:
        return "not installed"


def print_version() -> None:
    print(_pkg_version("explainthisrepo"))


def _has_env(key: str) -> bool:
    v = os.getenv(key)
    return bool(v and v.strip())


def _check_url(url: str, timeout: int = 6) -> tuple[bool, str]:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "explainthisrepo"})
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return True, f"ok ({r.status})"
    except Exception as e:
        return False, f"failed ({type(e).__name__}: {e})"


def run_doctor() -> int:
    is_termux = "TERMUX_VERSION" in os.environ or "com.termux" in os.getenv(
        "PREFIX", ""
    )

    print("explainthisrepo doctor report\n")

    print(f"python: {sys.version.split()[0]}")
    print(f"os: {platform.system()} {platform.release()}")
    print(f"platform: {platform.platform()}")
    print(f"termux: {is_termux}")

    print("\npackage versions:")
    print(f"- explainthisrepo: {_pkg_version('explainthisrepo')}")
    print(f"- requests: {_pkg_version('requests')}")
    print(f"- google-genai: {_pkg_version('google-genai')}")

    print("\nenvironment:")
    print(f"- GEMINI_API_KEY set: {_has_env('GEMINI_API_KEY')}")

    print("\nnetwork checks:")
    ok1, msg1 = _check_url("https://api.github.com")
    print(f"- github api: {msg1}")
    ok2, msg2 = _check_url("https://generativelanguage.googleapis.com")
    print(f"- gemini endpoint: {msg2}")

    print("\nnotes:")
    if is_termux:
        print("- Termux detected")
        print("- Install using:")
        print("  pip install --user -U explainthisrepo")
        print("- Ensure script PATH is available:")
        print('  export PATH="$HOME/.local/bin:$PATH"')
        print("- If PATH is annoying, run:")
        print("  python -m explain_this_repo owner/repo")

    return 0 if (ok1 and ok2) else 1


def safe_read_repo_files(owner: str, repo: str):
    try:
        return read_repo_signal_files(owner, repo)
    except Exception as e:
        print(f"warning: could not read repository files: {e}")
        return None


def generate_with_exit(prompt: str) -> str:
    try:
        return generate_explanation(prompt)
    except Exception as e:
        print("Failed to generate explanation.")
        print(f"error: {e}")
        print("\nfix:")
        print("- Ensure GEMINI_API_KEY is set")
        print("- Or run: explainthisrepo --doctor")
        raise SystemExit(1)


def main():
    parser = argparse.ArgumentParser(
        prog="explainthisrepo",
        description="Explain GitHub repositories in plain English",
        epilog="Examples:\n"
        "  explainthisrepo owner/repo\n"
        "  explainthisrepo https://github.com/owner/repo\n"
        "  explainthisrepo github.com/owner/repo\n"
        "  explainthisrepo git@github.com:owner/repo.git\n"
        "  explainthisrepo owner/repo --detailed\n"
        "  explainthisrepo owner/repo --quick\n"
        "  explainthisrepo owner/repo --simple\n"
        "  explainthisrepo owner/repo --stack\n"
        "  explainthisrepo --doctor\n"
        "  explainthisrepo --version",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )

    parser.add_argument(
        "--doctor",
        action="store_true",
        help="Run diagnostics",
    )

    parser.add_argument(
        "--version",
        action="store_true",
        help="Show version",
    )

    parser.add_argument(
        "repository",
        nargs="?",
        help="GitHub repository (owner/repo or URL)",
    )

    mode_group = parser.add_mutually_exclusive_group()
    mode_group.add_argument(
        "--quick",
        action="store_true",
        help="Quick summary mode",
    )
    mode_group.add_argument(
        "--simple",
        action="store_true",
        help="Simple summary mode",
    )
    mode_group.add_argument(
        "--detailed",
        action="store_true",
        help="Detailed explanation mode",
    )
    mode_group.add_argument(
        "--stack",
        action="store_true",
        help="Stack detection mode",
    )

    args = parser.parse_args()

    if args.doctor:
        raise SystemExit(run_doctor())

    if args.version:
        print_version()
        return

    if not args.repository:
        parser.error("repository argument required")

    target = args.repository

    try:
        owner, repo = resolve_repo_target(target)
    except ValueError as e:
        print(f"error: {e}")
        raise SystemExit(1)

    print(f"Fetching {owner}/{repo}...")

    if args.stack:
        try:
            read_result = read_repo_signal_files(owner, repo)
            languages = fetch_languages(owner, repo)
        except Exception as e:
            print(f"error: {e}")
            raise SystemExit(1)

        report = detect_stack(
            languages=languages,
            tree=read_result.tree,
            key_files=read_result.key_files,
        )

        print_stack(report, owner, repo)
        return

    try:
        repo_data = fetch_repo(owner, repo)
        readme = fetch_readme(owner, repo)
    except Exception as e:
        print(f"error: {e}")
        raise SystemExit(1)

    # QUICK MODE
    if args.quick:
        prompt = build_quick_prompt(
            repo_name=repo_data.get("full_name"),
            description=repo_data.get("description"),
            readme=readme,
        )

        print("Generating explanation...")

        output = generate_with_exit(prompt)

        print("Quick summary 🎉")
        print(output.strip())
        return

    # SIMPLE MODE
    if args.simple:
        read_result = safe_read_repo_files(owner, repo)

        prompt = build_simple_prompt(
            repo_name=repo_data.get("full_name"),
            description=repo_data.get("description"),
            readme=readme,
            tree_text=read_result.tree_text if read_result else None,
        )

        print("Generating explanation...")

        output = generate_with_exit(prompt)

        print("Simple summary 🎉")
        print(output.strip())
        return

    # NORMAL / DETAILED MODE
    read_result = safe_read_repo_files(owner, repo)

    prompt = build_prompt(
        repo_name=repo_data.get("full_name"),
        description=repo_data.get("description"),
        readme=readme,
        detailed=args.detailed,
        tree_text=read_result.tree_text if read_result else None,
        files_text=read_result.files_text if read_result else None,
    )

    print("Generating explanation...")

    output = generate_with_exit(prompt)

    print("Writing EXPLAIN.md...")
    write_output(output)

    word_count = len(output.split())
    print("EXPLAIN.md generated successfully 🎉")
    print(f"Words: {word_count}")
    print("Open EXPLAIN.md to read it.")


if __name__ == "__main__":
    main()
