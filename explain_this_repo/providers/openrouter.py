from __future__ import annotations

from typing import Any, Dict

from explain_this_repo.providers.base import LLMProvider, LLMProviderError


class OpenRouterProvider(LLMProvider):
    name = "openrouter"

    def __init__(self, config: Dict[str, Any]) -> None:
        self.config = config
        self.api_key = config.get("api_key")
        self.model = config.get("model")
        self._client = None

        self.validate_config()

    def validate_config(self) -> None:
        if not self.api_key or not str(self.api_key).strip():
            raise LLMProviderError(
                "OpenRouter provider requires an API key.\n"
                "Run `explainthisrepo init` or set providers.openrouter.api_key."
            )

        if not self.model or not str(self.model).strip():
            raise LLMProviderError(
                "OpenRouter provider requires a model.\n"
                "Set providers.openrouter.model (e.g. openai/gpt-4o, deepseek/deepseek-chat)."
            )

    def _get_client(self):
        if self._client is not None:
            return self._client

        try:
            from openai import OpenAI
        except ImportError as e:
            raise LLMProviderError(
                "OpenRouter support is not installed.\n"
                "Install it with:\n"
                '  pip install "explainthisrepo[openai]"'
            ) from e

        self._client = OpenAI(
            api_key=self.api_key,
            base_url="https://openrouter.ai/api/v1",
        )
        return self._client

    def generate(self, prompt: str) -> str:
        client = self._get_client()

        try:
            response = client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
            )
        except Exception as e:
            raise LLMProviderError(f"OpenRouter request failed: {e}") from e

        try:
            text = response.choices[0].message.content
        except Exception:
            text = None

        if not text or not text.strip():
            raise LLMProviderError("OpenRouter returned no text")

        return text.strip()

    def doctor(self) -> list[str]:
        return [
            f"OPENROUTER_API_KEY set: {bool(self.api_key)}",
            f"model: {self.model}",
        ]
