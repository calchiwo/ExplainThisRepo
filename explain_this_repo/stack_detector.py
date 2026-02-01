from __future__ import annotations
from typing import Dict, List

StackReport = Dict[str, List[str]]


def detect_stack(
    languages: Dict[str, int], tree: list[dict], key_files: Dict[str, str]
) -> StackReport:
    report: StackReport = {
        "languages": [],
        "runtimes": [],
        "frameworks": [],
        "databases": [],
        "tooling": [],
        "infra": [],
        "package_managers": [],
    }

    # Languages (from GitHub languages API)
    report["languages"] = sorted(languages.keys())

    # --- Package managers ---
    paths = {item.get("path", "").lower() for item in tree}

    if "pnpm-lock.yaml" in paths:
        report["package_managers"].append("pnpm")
    elif "yarn.lock" in paths:
        report["package_managers"].append("yarn")
    elif "package-lock.json" in paths:
        report["package_managers"].append("npm")

    if "requirements.txt" in paths or "pyproject.toml" in paths:
        report["package_managers"].append("pip")

    # --- Infra ---
    if "dockerfile" in paths:
        report["infra"].append("Docker")
    if "docker-compose.yml" in paths:
        report["infra"].append("Docker Compose")
    if any(p.startswith(".github/workflows") for p in paths):
        report["infra"].append("GitHub Actions")
    if "vercel.json" in paths:
        report["infra"].append("Vercel")

    # --- Frameworks from package.json ---
    pkg = key_files.get("package.json")
    if pkg:
        import json

        try:
            data = json.loads(pkg)
            deps = {**data.get("dependencies", {}), **data.get("devDependencies", {})}
        except Exception:
            deps = {}

        def has(name: str) -> bool:
            return name in deps

        if has("react"):
            report["frameworks"].append("React")
        if has("next"):
            report["frameworks"].append("Next.js")
        if has("express"):
            report["frameworks"].append("Express")
        if has("vue"):
            report["frameworks"].append("Vue")
        if has("django"):
            report["frameworks"].append("Django")
        if has("fastapi"):
            report["frameworks"].append("FastAPI")

        if has("prisma"):
            report["databases"].append("Prisma")
        if has("mongoose"):
            report["databases"].append("MongoDB")

        if has("jest"):
            report["tooling"].append("Jest")
        if has("eslint"):
            report["tooling"].append("ESLint")

    return report
