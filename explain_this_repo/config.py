from __future__ import annotations

import os
import platform
import tomllib
from pathlib import Path
from typing import Any, Dict, Optional

CONFIG_DIR_NAME = "ExplainThisRepo"
CONFIG_FILE_NAME = "config.toml"


def get_config_path() -> Path:
    system = platform.system().lower()

    if system == "windows":
        appdata = os.environ.get("APPDATA")
        if not appdata:
            raise RuntimeError("APPDATA environment variable is not set")
        base = Path(appdata) / CONFIG_DIR_NAME
    else:
        xdg = os.environ.get("XDG_CONFIG_HOME")
        if xdg:
            base = Path(xdg) / "explainthisrepo"
        else:
            base = Path.home() / ".config" / "explainthisrepo"

    return base / CONFIG_FILE_NAME


def ensure_config_dir() -> Path:
    path = get_config_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    return path


def read_raw_config() -> Optional[str]:
    path = get_config_path()
    if not path.exists():
        return None
    return path.read_text(encoding="utf-8")


def write_config(contents: str) -> None:
    path = ensure_config_dir()
    path.write_text(contents, encoding="utf-8")


def load_config() -> Dict[str, Any]:
    raw = read_raw_config()
    if raw is None:
        return {}

    try:
        return tomllib.loads(raw)
    except Exception as e:
        raise RuntimeError(f"Invalid config.toml: {e}") from e


def get_llm_provider_name(override: Optional[str] = None) -> str:
    if override:
        return override

    cfg = load_config()
    llm = cfg.get("llm", {})

    provider = llm.get("provider")
    if not provider:
        raise RuntimeError("No LLM provider configured.\n" "Run: explainthisrepo init")

    return provider


def get_provider_config(provider: str) -> Dict[str, Any]:
    cfg = load_config()
    providers = cfg.get("providers", {})

    provider_cfg = providers.get(provider)
    if provider_cfg is None:
        return {}

    if not isinstance(provider_cfg, dict):
        raise RuntimeError(f"Invalid config for provider '{provider}'")

    return provider_cfg
