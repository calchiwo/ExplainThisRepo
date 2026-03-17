from __future__ import annotations

from typing import Any, Dict

from explain_this_repo.providers.base import LLMProvider, LLMProviderError

DEFAULT_MODEL = "claude-3-5-sonnet-20241022"


class AnthropicProvider(LLMProvider):
    name = "anthropic"

    def __init__(self, config: Dict[str, Any]) -> None:
        self.config = config
        self.api_key = config.get("api_key")
        self.model = config.get("model", DEFAULT_MODEL)
        self._client = None

        self.validate_config()

    def validate_config(self) -> None:
        if not self.api_key or not str(self.api_key).strip():
            raise LLMProviderError(
                "Anthropic provider requires an API key.\n"
                "Run `explainthisrepo init` or set providers.anthropic.api_key."
            )

    def _get_client(self):
        if self._client is not None:
            return self._client

        try:
            from anthropic import Anthropic
        except ImportError as e:
            raise LLMProviderError(
                "Anthropic support is not installed.\n"
                "Install it with:\n"
                '  pip install "explainthisrepo[anthropic]"'
            ) from e

        self._client = Anthropic(api_key=self.api_key)
        return self._client

    def generate(self, prompt: str) -> str:
        client = self._get_client()

        try:
            response = client.messages.create(
                model=self.model,
                max_tokens=1024,
                messages=[{"role": "user", "content": prompt}],
            )
        except Exception as e:
            raise LLMProviderError(f"Anthropic request failed: {e}") from e

        try:
            text = response.content[0].text
        except Exception:
            text = None

        if not text or not text.strip():
            raise LLMProviderError("Anthropic returned no text")

        return text.strip()

    def doctor(self) -> list[str]:
        return [
            f"ANTHROPIC_API_KEY set: {bool(self.api_key)}",
            f"model: {self.model}",
        ]
