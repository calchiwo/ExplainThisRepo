from __future__ import annotations

import json
import urllib.error
import urllib.request
from typing import Any, Dict

from explain_this_repo.providers.base import LLMProvider, LLMProviderError

DEFAULT_MODEL = "llama3"
DEFAULT_HOST = "http://localhost:11434"


class OllamaProvider(LLMProvider):
    name = "ollama"

    def __init__(self, config: Dict[str, Any]) -> None:
        self.model = config.get("model", DEFAULT_MODEL)
        self.host = config.get("host", DEFAULT_HOST).rstrip("/")

    def generate(self, prompt: str) -> str:
        url = f"{self.host}/api/generate"

        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False,
        }

        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )

        try:
            with urllib.request.urlopen(req, timeout=120) as response:
                raw = response.read().decode("utf-8")
        except urllib.error.URLError as e:
            raise LLMProviderError(
                "Failed to connect to Ollama.\n"
                "Ensure Ollama is running locally.\n"
                "Start it with: ollama serve"
            ) from e
        except Exception as e:
            raise LLMProviderError(f"Ollama request failed: {e}") from e

        try:
            data = json.loads(raw)
        except Exception as e:
            raise LLMProviderError("Invalid response from Ollama") from e

        text = data.get("response")
        if not text:
            raise LLMProviderError("Ollama returned no text")

        return text.strip()
