import os
import time
from typing import Optional

import requests

from explain_this_repo.config import load_config

GITHUB_API_BASE = "https://api.github.com"


def _get_token(token: Optional[str] = None) -> Optional[str]:
    if token and token.strip():
        return token.strip()

    try:
        cfg = load_config() or {}
        if isinstance(cfg, dict):
            github_cfg = cfg.get("github", {})
            if isinstance(github_cfg, dict):
                cfg_token = github_cfg.get("token")
                if cfg_token and str(cfg_token).strip():
                    return str(cfg_token).strip()
    except Exception:
        pass

    env_token = os.getenv("GITHUB_TOKEN") or os.getenv("GH_TOKEN")
    if env_token and env_token.strip():
        return env_token.strip()

    return None


def _make_session(token: Optional[str] = None) -> requests.Session:
    session = requests.Session()

    headers = {
        "User-Agent": "explainthisrepo/1.0",
        "Accept": "application/vnd.github+json",
    }

    resolved_token = _get_token(token)
    if resolved_token:
        headers["Authorization"] = f"Bearer {resolved_token}"

    session.headers.update(headers)
    return session


def _rate_limit_message(response: requests.Response) -> str:
    remaining = response.headers.get("X-RateLimit-Remaining")
    reset = response.headers.get("X-RateLimit-Reset")

    if remaining == "0" and reset:
        try:
            reset_ts = int(reset)
            wait_s = max(0, reset_ts - int(time.time()))
            mins = (wait_s + 59) // 60
            return (
                "GitHub API rate limit exceeded.\n"
                f"Try again in ~{mins} minute(s).\n"
                "Fix:\n"
                "- Set GITHUB_TOKEN in config or environment\n"
                "- Or run `explainthisrepo init`\n"
            )
        except Exception:
            pass

    # GitHub sometimes returns secondary rate limit without clean headers
    return (
        "GitHub API rate limit exceeded.\n"
        "Fix:\n"
        "- Set GITHUB_TOKEN in config or environment\n"
        "- Or run `explainthisrepo init`\n"
    )


def _request_json(
    session: requests.Session,
    url: str,
    *,
    timeout: int = 10,
    retries: int = 4,
) -> dict:
    backoff = 1.5

    for attempt in range(retries + 1):
        try:
            response = session.get(url, timeout=timeout)
        except requests.RequestException as e:
            if attempt == retries:
                raise RuntimeError(f"Network error while calling GitHub: {e}") from e
            time.sleep(backoff)
            backoff *= 2
            continue

        if response.status_code == 200:
            return response.json()

        if response.status_code == 404:
            raise RuntimeError(
                "Repository not found.\n"
                "If this is a private repository, configure GitHub access:\n"
                "- Run `explainthisrepo init`\n"
                "- Or set GITHUB_TOKEN"
            )

        if response.status_code in (403, 429):
            text_lower = (response.text or "").lower()

            if response.headers.get("X-RateLimit-Remaining") == "0":
                raise RuntimeError(_rate_limit_message(response))

            if "secondary rate limit" in text_lower or "rate limit" in text_lower:
                if attempt == retries:
                    raise RuntimeError(_rate_limit_message(response))
                time.sleep(backoff)
                backoff *= 2
                continue

            raise RuntimeError("GitHub API access forbidden (403).")

        if 500 <= response.status_code <= 599:
            if attempt == retries:
                raise RuntimeError(
                    f"GitHub API server error ({response.status_code}). Try again later."
                )
            time.sleep(backoff)
            backoff *= 2
            continue

        raise RuntimeError(f"GitHub API request failed ({response.status_code}).")

    raise RuntimeError("GitHub request failed unexpectedly.")


def _request_text(
    session: requests.Session,
    url: str,
    *,
    accept: str,
    timeout: int = 10,
    retries: int = 4,
) -> Optional[str]:
    backoff = 1.5

    for attempt in range(retries + 1):
        try:
            response = session.get(url, headers={"Accept": accept}, timeout=timeout)
        except requests.RequestException:
            if attempt == retries:
                return None
            time.sleep(backoff)
            backoff *= 2
            continue

        if response.status_code == 200:
            return response.text

        if response.status_code == 404:
            return None

        if response.status_code in (403, 429):
            text_lower = (response.text or "").lower()

            if response.headers.get("X-RateLimit-Remaining") == "0":
                return None

            if "secondary rate limit" in text_lower or "rate limit" in text_lower:
                if attempt == retries:
                    return None
                time.sleep(backoff)
                backoff *= 2
                continue

            return None

        if 500 <= response.status_code <= 599:
            if attempt == retries:
                return None
            time.sleep(backoff)
            backoff *= 2
            continue

        return None

    return None


def fetch_repo(owner: str, repo: str, token: Optional[str] = None) -> dict:
    session = _make_session(token)
    url = f"{GITHUB_API_BASE}/repos/{owner}/{repo}"
    return _request_json(session, url)


def fetch_readme(owner: str, repo: str, token: Optional[str] = None) -> str | None:
    session = _make_session(token)

    api_url = f"{GITHUB_API_BASE}/repos/{owner}/{repo}/readme"
    text = _request_text(
        session,
        api_url,
        accept="application/vnd.github.v3.raw",
    )
    if text:
        return text

    branches = ["main", "master"]
    filenames = ["README.md", "readme.md", "README.MD"]

    for branch in branches:
        for name in filenames:
            raw_url = (
                f"https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{name}"
            )
            raw = _request_text(
                session,
                raw_url,
                accept="text/plain",
                timeout=10,
                retries=2,
            )
            if raw:
                return raw

    return None


def fetch_tree(owner: str, repo: str, token: Optional[str] = None) -> list[dict]:
    """
    Uses Git Trees API to fetch full file tree.
    """
    session = _make_session(token)
    repo_meta = fetch_repo(owner, repo, token=token)
    branch = repo_meta.get("default_branch") or "main"

    url = f"{GITHUB_API_BASE}/repos/{owner}/{repo}/git/trees/{branch}?recursive=1"
    data = _request_json(session, url)

    tree = data.get("tree", [])
    if not isinstance(tree, list):
        return []
    return tree


def fetch_file(
    owner: str,
    repo: str,
    file_path: str,
    token: Optional[str] = None,
) -> str | None:
    """
    Fetch raw file content for a given path.
    """
    session = _make_session(token)
    url = f"{GITHUB_API_BASE}/repos/{owner}/{repo}/contents/{file_path}"
    return _request_text(
        session,
        url,
        accept="application/vnd.github.v3.raw",
        timeout=10,
        retries=2,
    )


def fetch_languages(owner: str, repo: str, token: Optional[str] = None) -> dict:
    session = _make_session(token)
    url = f"{GITHUB_API_BASE}/repos/{owner}/{repo}/languages"
    return _request_json(session, url)
