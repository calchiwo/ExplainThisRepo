#!/usr/bin/env python3
from pathlib import Path
import tomllib

pyproject = Path(__file__).resolve().parent.parent / "pyproject.toml"
data = tomllib.loads(pyproject.read_text(encoding="utf-8"))
print(data["project"]["version"])