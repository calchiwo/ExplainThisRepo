import requests

GITHUB_API_BASE = "https://api.github.com"


def fetch_repo(owner: str, repo: str) -> dict:
    url = f"{GITHUB_API_BASE}/repos/{owner}/{repo}"
    response = requests.get(url)

    if response.status_code != 200:
        raise RuntimeError("Failed to fetch repository metadata")

    return response.json()


def fetch_readme(owner: str, repo: str) -> str | None:
    url = f"{GITHUB_API_BASE}/repos/{owner}/{repo}/readme"
    headers = {"Accept": "application/vnd.github.v3.raw"}
    response = requests.get(url, headers=headers)

    if response.status_code == 404:
        return None

    if response.status_code != 200:
        raise RuntimeError("Failed to fetch README")

    return response.text
