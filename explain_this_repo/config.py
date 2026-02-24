import os
import platform
from pathlib import Path
from typing import Optional

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


def read_config() -> Optional[str]:
    path = get_config_path()
    if not path.exists():
        return None
    return path.read_text(encoding="utf-8")


def write_config(contents: str) -> None:
    path = ensure_config_dir()
    path.write_text(contents, encoding="utf-8")
