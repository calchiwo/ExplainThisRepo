import os
import sys
import platform
import urllib.request
from importlib.metadata import version, PackageNotFoundError

from explain_this_repo.github import fetch_repo, fetch_readme
from explain_this_repo.prompt import build_prompt
from explain_this_repo.generate import generate_explanation
from explain_this_repo.writer import write_output


def _pkg_version(name: str) -> str:
    try:
        return version(name)
    except PackageNotFoundError:
        return "not installed"


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
    is_termux = "TERMUX_VERSION" in os.environ or "com.termux" in os.getenv("PREFIX", "")

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
        print('  Export PATH="$HOME/.local/bin:$PATH"')
        print("- If PATH is annoying, run:")
        print("  python -m explain_this_repo owner/repo")

    return 0 if ok1 else 1


def usage() -> None:
    print("usage:")
    print("  explainthisrepo owner/repo")
    print("  explainthisrepo owner/repo --detailed")
    print("  explainthisrepo --doctor")
    print("  python -m explain_this_repo owner/repo")


def main():
    args = sys.argv[1:]

    if not args or args[0] in {"-h", "--help"}:
        usage()
        return

    if args[0] == "--doctor":
        raise SystemExit(run_doctor())

    detailed = False

    if len(args) == 2:
        if args[1] != "--detailed":
            usage()
            raise SystemExit(1)
        detailed = True
    elif len(args) != 1:
        usage()
        raise SystemExit(1)

    target = args[0]

    if "/" not in target or target.count("/") != 1:
        print("invalid format. use owner/repo")
        raise SystemExit(1)

    owner, repo = target.split("/")
    if not owner or not repo:
        print("invalid format. use owner/repo")
        raise SystemExit(1)

    print(f"Fetching {owner}/{repo}...")

    try:
        repo_data = fetch_repo(owner, repo)
        readme = fetch_readme(owner, repo)
    except Exception as e:
        print(f"error: {e}")
        raise SystemExit(1)

    prompt = build_prompt(
        repo_name=repo_data.get("full_name"),
        description=repo_data.get("description"),
        readme=readme,
        detailed=detailed,
    )

    print("Generating explanation...")

    try:
        output = generate_explanation(prompt)
    except Exception as e:
        print("Failed to generate explanation.")
        print(f"error: {e}")
        print("\nfix:")
        print("- Ensure GEMINI_API_KEY is set")
        print("- Or run: explainthisrepo --doctor")
        raise SystemExit(1)

    print("Writing EXPLAIN.md...")
    write_output(output)

    word_count = len(output.split())
    print("EXPLAIN.md generated successfully 🎉")
    print(f"Words: {word_count}")
    print("Open EXPLAIN.md to read it.")


if __name__ == "__main__":
    main()
