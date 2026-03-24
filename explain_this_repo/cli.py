import argparse
import os
import platform
import sys
import urllib.request
from importlib.metadata import PackageNotFoundError, version
from urllib.parse import urlparse

from rich.console import Console

from explain_this_repo.generate import generate_explanation
from explain_this_repo.github import fetch_languages, fetch_readme, fetch_repo
from explain_this_repo.local_reader import read_local_repo_signal_files
from explain_this_repo.prompt import (build_prompt, build_quick_prompt,
                                      build_simple_prompt)
from explain_this_repo.repo_reader import read_repo_signal_files
from explain_this_repo.stack_detector import detect_stack
from explain_this_repo.stack_printer import print_stack
from explain_this_repo.writer import write_output

console = Console()


def resolve_repo_target(target: str) -> tuple[str, str]:
    target = target.strip()

    if target.startswith("https//"):
        target = target.replace("https//", "https://", 1)
    if target.startswith("http//"):
        target = target.replace("http//", "http://", 1)

    if target.startswith("git@github.com:"):
        path = target.replace("git@github.com:", "", 1)
        if "/" not in path:
            raise ValueError("Invalid GitHub SSH repository URL")
        owner, repo = path.split("/", 1)
        return owner, repo.removesuffix(".git")

    if target.startswith("github.com/"):
        target = "https://" + target

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


def _run_provider_diagnostics(provider: object, provider_name: str) -> bool:

    try:
        result = provider.doctor()
    except AttributeError:
        print(f"- {provider_name}: no diagnostics implemented")
        return True
    except Exception as e:
        print(f"- {provider_name}: diagnostics raised an unexpected error ({e})")
        return False

    if isinstance(result, bool):
        if result:
            print(f"- {provider_name}: ok")
        else:
            print(f"- {provider_name}: checks did not pass")
        return result

    if isinstance(result, list):
        if not result:
            print(f"- {provider_name}: ok")
            return True
        for line in result:
            print(f"- {provider_name}: {line}")
        return False

    print(
        f"- {provider_name}: doctor() returned unexpected type {type(result).__name__!r}"
    )
    return False


def run_doctor(llm_override: str | None = None) -> int:
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

    print("\nnetwork checks:")
    ok_gh, msg_gh = _check_url("https://api.github.com")
    print(f"- github api: {msg_gh}")

    print("\ngithub auth:")

    if _has_env("GITHUB_TOKEN") or _has_env("GH_TOKEN"):
        print("- token: set")
    else:
        print("- token: not set (limited rate + no private repos)")

    print("\nprovider diagnostics:")

    provider = None
    provider_name = None
    provider_ok = True

    try:
        from explain_this_repo.providers.registry import get_active_provider

        provider = get_active_provider(override=llm_override)
        provider_name = getattr(provider, "name", llm_override or "unknown")

    except ValueError:
        if llm_override is not None:
            print(f"- provider '{llm_override}' could not be resolved")
            print("- check that the provider name is correct and properly installed")
            provider_ok = False
        else:
            print("- no provider configured and no --llm override given")
            print("- skipping provider checks")
            print("- run `explainthisrepo init` to configure a provider")

    except ImportError as e:
        print(f"- provider registry could not be loaded (import error): {e}")
        print("- this is likely a broken installation")
        provider_ok = False

    except Exception as e:
        print(f"- provider registry raised an unexpected error: {e}")
        provider_ok = False

    if provider is not None:
        print(f"- active provider: {provider_name}")
        provider_ok = _run_provider_diagnostics(provider, provider_name)

    print("\nnotes:")
    if is_termux:
        print("- Termux detected")
        print("- Install using:")
        print("  pip install --user -U explainthisrepo")
        print("- Ensure script PATH is available:")
        print('  export PATH="$HOME/.local/bin:$PATH"')
        print("- If PATH is annoying, run:")
        print("  python -m explain_this_repo owner/repo")

    return 0 if (ok_gh and provider_ok) else 1


def safe_read_repo_files(owner: str, repo: str):
    try:
        return read_repo_signal_files(owner, repo)
    except Exception as e:
        print(f"warning: could not read repository files: {e}")
        return None


def generate_with_exit(prompt: str, llm: str | None = None) -> str:
    try:
        return generate_explanation(prompt, provider_override=llm)
    except ValueError as e:
        print(f"error: {e}")
        print("\nfix:")
        print(
            "- Check that the provider name is correct (e.g. gemini, openai, ollama, anthropic, openrouter)"
        )
        print("- Or run: explainthisrepo --doctor")
        raise SystemExit(1)
    except ImportError as e:
        print(f"error: missing dependencies for the selected provider: {e}")
        print("\nfix:")
        print("- Install the required provider package")
        print("- Or run: explainthisrepo --doctor")
        raise SystemExit(1)
    except Exception as e:
        print("Failed to generate explanation.")
        print(f"error: {e}")
        print("\nfix:")
        print("- Ensure your API key is set for the selected provider")
        print("- Or run: explainthisrepo --doctor")
        raise SystemExit(1)


def main():
    parser = argparse.ArgumentParser(
        prog="explainthisrepo",
        description="The fastest way to understand any codebase in plain English",
        epilog="Examples:\n"
        "  explainthisrepo owner/repo\n"
        "  explainthisrepo https://github.com/owner/repo\n"
        "  explainthisrepo github.com/owner/repo\n"
        "  explainthisrepo git@github.com:owner/repo.git\n"
        "  explainthisrepo owner/repo --detailed\n"
        "  explainthisrepo owner/repo --quick\n"
        "  explainthisrepo owner/repo --simple\n"
        "  explainthisrepo owner/repo --stack\n"
        "  explainthisrepo init\n"
        "  explainthisrepo owner/repo --llm gemini\n"
        "  explainthisrepo owner/repo --llm openai\n"
        "  explainthisrepo owner/repo --llm ollama\n"
        "  explainthisrepo .\n"
        "  explainthisrepo ./path/to/directory\n"
        "  explainthisrepo . --detailed\n"
        "  explainthisrepo . --quick\n"
        "  explainthisrepo . --simple\n"
        "  explainthisrepo . --stack\n"
        "  explainthisrepo --doctor\n"
        "  explainthisrepo --doctor --llm gemini\n"
        "  explainthisrepo --doctor --llm openai\n"
        "  explainthisrepo --doctor --llm ollama\n"
        "  explainthisrepo --version\n"
        "GitHub token:\n"
        "  Access private repos and higher rate limits\n"
        "  Run:\n"
        "   explainthisrepo init\n"
        "  Or set:\n"
        "   GITHUB_TOKEN=ghp_xxx explainthisrepo owner/repo\n",
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
        "--llm",
        metavar="PROVIDER",
        default=None,
        help="LLM provider to use (e.g. gemini, openai, ollama, anthropic, openrouter). Overrides config default.",
    )

    parser.add_argument(
        "command",
        nargs="?",
        help="Optional command (e.g. explainthisrepo init)",
    )

    parser.add_argument(
        "repository",
        nargs="?",
        help="GitHub repository (owner/repo or URL) or local directories",
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

    if args.command == "init" and args.repository is None:
        from explain_this_repo.init import run_init

        run_init()
        return

    if args.doctor:
        raise SystemExit(run_doctor(llm_override=args.llm))

    if args.version:
        print_version()
        return

    if args.llm is not None:
        from explain_this_repo.providers.registry import list_providers

        known = list_providers()
        if args.llm not in known:
            print(f"error: unknown provider '{args.llm}'")
            print(f"available providers: {', '.join(sorted(known))}")
            raise SystemExit(1)

    llm = args.llm

    if args.repository is None and args.command is not None and args.command != "init":
        args.repository = args.command
        args.command = None

    if not args.repository:
        parser.error(
            "repository argument required (or use 'explainthisrepo init') to set up API key or GitHub token"
        )

    target = args.repository

    local = os.path.exists(target)

    if local:
        local_path = os.path.abspath(target)
        print(f"Analyzing local directory: {target}")
    else:
        try:
            owner, repo = resolve_repo_target(target)
        except ValueError as e:
            print(f"error: {e}")
            raise SystemExit(1)

    if args.stack:
        if local:
            with console.status("Reading repository files…", spinner="dots"):
                read_result = read_local_repo_signal_files(local_path)
            languages = {}
        else:
            try:
                with console.status(f"Fetching {owner}/{repo}…", spinner="dots"):
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

        label = target if local else f"{owner}/{repo}"
        print_stack(report, label, "")
        return

    if not local:
        try:
            with console.status(f"Fetching {owner}/{repo}…", spinner="dots"):
                repo_data = fetch_repo(owner, repo)
                readme = fetch_readme(owner, repo)
        except Exception as e:
            print(f"error: {e}")
            raise SystemExit(1)
    else:
        repo_data = {}
        readme = None

    # QUICK MODE
    if args.quick:
        if local:
            with console.status("Reading repository files…", spinner="dots"):
                read_result = read_local_repo_signal_files(local_path)
            readme_content = read_result.key_files.get(
                next(
                    (
                        k
                        for k in read_result.key_files
                        if k.lower().startswith("readme")
                    ),
                    "",
                ),
                None,
            )
            prompt = build_quick_prompt(
                repo_name=local_path,
                description=None,
                readme=readme_content,
            )
        else:
            prompt = build_quick_prompt(
                repo_name=repo_data.get("full_name"),
                description=repo_data.get("description"),
                readme=readme,
            )

        with console.status("Generating explanation…", spinner="dots"):
            output = generate_with_exit(prompt, llm=llm)

        print("Quick summary 🎉")
        print(output.strip())
        return

    # SIMPLE MODE
    if args.simple:
        if local:
            with console.status("Reading repository files…", spinner="dots"):
                read_result = read_local_repo_signal_files(local_path)
        else:
            with console.status("Reading repository files…", spinner="dots"):
                read_result = safe_read_repo_files(owner, repo)

        prompt = build_simple_prompt(
            repo_name=local_path if local else repo_data.get("full_name"),
            description=None if local else repo_data.get("description"),
            readme=None if local else readme,
            tree_text=read_result.tree_text if read_result else None,
        )

        with console.status("Generating explanation…", spinner="dots"):
            output = generate_with_exit(prompt, llm=llm)

        print("Simple summary 🎉")
        print(output.strip())
        return

    # NORMAL / DETAILED MODE
    if local:
        with console.status("Reading repository files…", spinner="dots"):
            read_result = read_local_repo_signal_files(local_path)
    else:
        with console.status("Reading repository files…", spinner="dots"):
            read_result = safe_read_repo_files(owner, repo)

    prompt = build_prompt(
        repo_name=local_path if local else repo_data.get("full_name"),
        description=None if local else repo_data.get("description"),
        readme=None if local else readme,
        detailed=args.detailed,
        tree_text=read_result.tree_text if read_result else None,
        files_text=read_result.files_text if read_result else None,
    )

    with console.status("Generating explanation…", spinner="dots"):
        output = generate_with_exit(prompt, llm=llm)

    print("Writing EXPLAIN.md...")
    write_output(output)

    word_count = len(output.split())
    print("EXPLAIN.md generated successfully 🎉")
    print(f"Words: {word_count}")
    print("Open EXPLAIN.md to read it.")


def _run():
    try:
        main()
    except KeyboardInterrupt:
        print("\nInterrupted.", file=sys.stderr)
        raise SystemExit(130)


if __name__ == "__main__":
    _run()
