from __future__ import annotations

from typing import Any, Dict

from explain_this_repo.providers.base import LLMProvider, LLMProviderError

DEFAULT_MODEL = "gpt-4o-mini"


class OpenAIProvider(LLMProvider):
    name = "openai"

    def __init__(self, config: Dict[str, Any]) -> None:
        self.api_key = config.get("api_key")
        self.model = config.get("model", DEFAULT_MODEL)

        if not self.api_key:
            raise LLMProviderError(
                "OpenAI provider requires an API key.\n"
                "Run 'explainthisrepo init' or set providers.openai.api_key."
            )

        self._client = None

    def _get_client(self):
        if self._client is not None:
            return self._client

        try:
            from openai import OpenAI
        except ImportError as e:
            raise LLMProviderError(
                "OpenAI support is not installed.\n"
                "Install it with:\n"
                '  pip install "explainthisrepo[openai]"'
            ) from e

        self._client = OpenAI(api_key=self.api_key)
        return self._client

    def generate(self, prompt: str) -> str:
        client = self._get_client()

        try:
            response = client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
            )
        except Exception as e:
            raise LLMProviderError(f"OpenAI request failed: {e}") from e

        try:
            text = response.choices[0].message.content
        except Exception:
            text = None

        if not text:
            raise LLMProviderError("OpenAI returned no text")

        return text.strip()
