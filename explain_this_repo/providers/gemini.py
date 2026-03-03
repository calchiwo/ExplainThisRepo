from __future__ import annotations

from typing import Any, Dict

from explain_this_repo.providers.base import LLMProvider, LLMProviderError

DEFAULT_MODEL = "gemini-2.5-flash-lite"


class GeminiProvider(LLMProvider):
    name = "gemini"

    def __init__(self, config: Dict[str, Any]) -> None:
        self.config = config
        self.api_key = config.get("api_key")
        self.model = config.get("model", DEFAULT_MODEL)
        self._client = None

        self.validate_config()

    def validate_config(self) -> None:
        if not self.api_key or not str(self.api_key).strip():
            raise LLMProviderError(
                "Gemini provider requires an API key.\n"
                "Run `explainthisrepo init` or set providers.gemini.api_key."
            )

    def _get_client(self):
        if self._client is not None:
            return self._client

        try:
            from google import genai
        except ImportError as e:
            raise LLMProviderError(
                "Gemini support is not installed.\n"
                "Install it with:\n"
                '  pip install "explainthisrepo[gemini]"'
            ) from e

        self._client = genai.Client(api_key=self.api_key)
        return self._client

    def generate(self, prompt: str) -> str:
        client = self._get_client()

        try:
            response = client.models.generate_content(
                model=self.model,
                contents=prompt,
            )
        except Exception as e:
            raise LLMProviderError(f"Gemini request failed: {e}") from e

        text = getattr(response, "text", None)
        if not text:
            raise LLMProviderError("Gemini returned no text")

        return text.strip()
