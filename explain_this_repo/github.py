import os
import time
from typing import Optional

import requests

GITHUB_API_BASE = "https://api.github.com"


def _get_token() -> Optional[str]:
    return os.getenv("GITHUB_TOKEN") or os.getenv("GH_TOKEN")


def _make_session() -> requests.Session:
    session = requests.Session()

    headers = {
        "User-Agent": "explainthisrepo/1.0",
        "Accept": "application/vnd.github+json",
    }

    token = _get_token()
    if token:
        headers["Authorization"] = f"Bearer {token}"

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
                f"Try again in ~{mins} minute(s), or set GITHUB_TOKEN to raise limits."
            )
        except Exception:
            pass

    # GitHub sometimes returns secondary rate limit without clean headers
    return (
        "GitHub API rate limit exceeded.\n"
        "Try again later, or set GITHUB_TOKEN to raise limits."
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

        # Success
        if response.status_code == 200:
            return response.json()

        # Not found
        if response.status_code == 404:
            raise RuntimeError("Repository not found.")

        # Rate limit / throttling
        if response.status_code in (403, 429):
            text_lower = (response.text or "").lower()

            # Primary rate limit headers
            if response.headers.get("X-RateLimit-Remaining") == "0":
                raise RuntimeError(_rate_limit_message(response))

            # Secondary rate limit
            if "secondary rate limit" in text_lower or "rate limit" in text_lower:
                if attempt == retries:
                    raise RuntimeError(_rate_limit_message(response))
                time.sleep(backoff)
                backoff *= 2
                continue

            # Forbidden for other reasons
            raise RuntimeError("GitHub API access forbidden (403).")

        # Temporary server issues
        if 500 <= response.status_code <= 599:
            if attempt == retries:
                raise RuntimeError(
                    f"GitHub API server error ({response.status_code}). Try again later."
                )
            time.sleep(backoff)
            backoff *= 2
            continue

        # Other errors
        raise RuntimeError(f"GitHub API request failed ({response.status_code}).")

    # Should never reach here
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


def fetch_repo(owner: str, repo: str) -> dict:
    session = _make_session()
    url = f"{GITHUB_API_BASE}/repos/{owner}/{repo}"
    return _request_json(session, url)


def fetch_readme(owner: str, repo: str) -> str | None:
    session = _make_session()

    # 1) Try GitHub API raw endpoint
    api_url = f"{GITHUB_API_BASE}/repos/{owner}/{repo}/readme"
    text = _request_text(
        session,
        api_url,
        accept="application/vnd.github.v3.raw",
    )
    if text:
        return text

    # 2) Fallback: try common default branches from raw.githubusercontent.com
    # This avoids GitHub API rate limits entirely.
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


def fetch_tree(owner: str, repo: str) -> list[dict]:
    """
    Uses Git Trees API to fetch full file tree.
    """
    session = _make_session()
    # get default branch first
    repo_meta = fetch_repo(owner, repo)
    branch = repo_meta.get("default_branch") or "main"

    url = f"{GITHUB_API_BASE}/repos/{owner}/{repo}/git/trees/{branch}?recursive=1"
    data = _request_json(session, url)

    tree = data.get("tree", [])
    if not isinstance(tree, list):
        return []
    return tree


def fetch_file(owner: str, repo: str, file_path: str) -> str | None:
    """
    Fetch raw file content for a given path.
    """
    session = _make_session()
    url = f"{GITHUB_API_BASE}/repos/{owner}/{repo}/contents/{file_path}"
    return _request_text(
        session,
        url,
        accept="application/vnd.github.v3.raw",
        timeout=10,
        retries=2,
    )


def fetch_languages(owner: str, repo: str) -> dict:
    url = f"https://api.github.com/repos/{owner}/{repo}/languages"
    r = requests.get(url, headers={"User-Agent": "ExplainThisRepo"})
    r.raise_for_status()
    return r.json()
