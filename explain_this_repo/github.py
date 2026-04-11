from __future__ import annotations

import base64
import binascii
import os
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Optional
from urllib.parse import quote

import requests

from explain_this_repo.config import load_config

GITHUB_API_BASE = "https://api.github.com"
_MAX_FILE_BYTES = 32_000
_SAMPLE_SIZE = 4_096


@dataclass(frozen=True, slots=True)
class GitHubFileReadResult:
    owner: str
    repo: str
    path: str
    name: str
    extension: str
    size_bytes: int
    content: str
    is_text: bool
    sha: str | None = None
    encoding: str | None = None


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
                "- Or set GITHUB_TOKEN (see https://github.com/calchiwo/ExplainThisRepo/blob/main/docs/GITHUB_TOKEN.md)"
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


def _normalize_github_path(file_path: str) -> str:
    cleaned = file_path.strip()
    while cleaned.startswith("./"):
        cleaned = cleaned[2:]
    cleaned = cleaned.lstrip("/")
    if not cleaned:
        raise RuntimeError("GitHub file path is empty.")
    return cleaned


def _quote_github_path(file_path: str) -> str:
    return quote(file_path, safe="/")


def _decode_base64_content(content: str) -> bytes:
    cleaned = "".join(content.split())
    if not cleaned:
        return b""

    pad = (-len(cleaned)) % 4
    if pad:
        cleaned += "=" * pad

    try:
        return base64.b64decode(cleaned, validate=True)
    except (ValueError, binascii.Error) as e:
        raise RuntimeError("Failed to decode GitHub base64 file content.") from e


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

    raise RuntimeError("GitHub file appears to be binary or uses an unsupported text encoding.")


def _request_contents_json(
    session: requests.Session,
    url: str,
    *,
    owner: str,
    repo: str,
    path: str,
    timeout: int = 10,
    retries: int = 4,
) -> object:
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
            raise RuntimeError(f"GitHub 404: {owner}/{repo}/{path} not found.")

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

            if "resource not accessible by integration" in text_lower or "private" in text_lower:
                raise RuntimeError(
                    f"GitHub API access forbidden (403) for {owner}/{repo}/{path}.\n"
                    "If this is a private repository, check your GitHub token permissions."
                )

            raise RuntimeError(
                f"GitHub API access forbidden (403) for {owner}/{repo}/{path}."
            )

        if 500 <= response.status_code <= 599:
            if attempt == retries:
                raise RuntimeError(
                    f"GitHub API server error ({response.status_code}) while fetching {owner}/{repo}/{path}."
                )
            time.sleep(backoff)
            backoff *= 2
            continue

        raise RuntimeError(
            f"GitHub API request failed ({response.status_code}) while fetching {owner}/{repo}/{path}."
        )

    raise RuntimeError("GitHub request failed unexpectedly.")


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
            raw_url = f"https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{name}"
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
    session = _make_session(token)
    url = f"{GITHUB_API_BASE}/repos/{owner}/{repo}/contents/{file_path}"
    return _request_text(
        session,
        url,
        accept="application/vnd.github.v3.raw",
        timeout=10,
        retries=2,
    )


def fetch_file_result(
    owner: str,
    repo: str,
    file_path: str,
    token: Optional[str] = None,
    max_bytes: int = _MAX_FILE_BYTES,
) -> GitHubFileReadResult:
    normalized_path = _normalize_github_path(file_path)
    session = _make_session(token)
    url = f"{GITHUB_API_BASE}/repos/{owner}/{repo}/contents/{_quote_github_path(normalized_path)}"

    payload = _request_contents_json(
        session,
        url,
        owner=owner,
        repo=repo,
        path=normalized_path,
    )

    if isinstance(payload, list):
        raise RuntimeError(
            f"GitHub path resolves to a directory, not a file: {owner}/{repo}/{normalized_path}"
        )

    if not isinstance(payload, dict):
        raise RuntimeError(
            f"GitHub API returned unexpected data for {owner}/{repo}/{normalized_path}."
        )

    entry_type = str(payload.get("type") or "").lower()
    if entry_type == "dir":
        raise RuntimeError(
            f"GitHub path resolves to a directory, not a file: {owner}/{repo}/{normalized_path}"
        )

    if entry_type and entry_type not in {"file", "symlink", "submodule"}:
        raise RuntimeError(
            f"GitHub path does not resolve to a file: {owner}/{repo}/{normalized_path}"
        )

    if entry_type in {"symlink", "submodule"}:
        raise RuntimeError(
            f"GitHub path does not resolve to a regular file: {owner}/{repo}/{normalized_path}"
        )

    size_value = payload.get("size")
    try:
        size_bytes = int(size_value) if size_value is not None else None
    except Exception:
        size_bytes = None

    if size_bytes is not None and size_bytes > max_bytes:
        raise RuntimeError(
            f"GitHub file too large: {owner}/{repo}/{normalized_path} ({size_bytes} bytes, limit {max_bytes} bytes)"
        )

    if payload.get("truncated") is True:
        raise RuntimeError(
            f"GitHub file is truncated and cannot be explained safely: {owner}/{repo}/{normalized_path}"
        )

    encoding = str(payload.get("encoding") or "").lower()
    if encoding != "base64":
        raise RuntimeError(
            f"GitHub file encoding is unsupported for {owner}/{repo}/{normalized_path}."
        )

    content_field = payload.get("content")
    if not isinstance(content_field, str) or not content_field.strip():
        raise RuntimeError(
            f"GitHub file content is unavailable for {owner}/{repo}/{normalized_path}."
        )

    raw = _decode_base64_content(content_field)

    if len(raw) > max_bytes:
        raise RuntimeError(
            f"GitHub file too large: {owner}/{repo}/{normalized_path} ({len(raw)} bytes, limit {max_bytes} bytes)"
        )

    if _is_probably_binary(raw[:_SAMPLE_SIZE]):
        raise RuntimeError(
            f"binary GitHub files are not supported: {owner}/{repo}/{normalized_path}"
        )

    text = _decode_text(raw)
    if not text.strip():
        raise RuntimeError(
            f"GitHub file content is empty: {owner}/{repo}/{normalized_path}"
        )

    name = Path(normalized_path).name
    extension = Path(normalized_path).suffix.lower().lstrip(".")
    sha = payload.get("sha")
    if sha is not None:
        sha = str(sha)

    reported_size = size_bytes if size_bytes is not None else len(raw)

    return GitHubFileReadResult(
        owner=owner,
        repo=repo,
        path=normalized_path,
        name=name,
        extension=extension,
        size_bytes=reported_size,
        content=text,
        is_text=True,
        sha=sha,
        encoding=encoding,
    )


def fetch_languages(owner: str, repo: str, token: Optional[str] = None) -> dict:
    session = _make_session(token)
    url = f"{GITHUB_API_BASE}/repos/{owner}/{repo}/languages"
    return _request_json(session, url)