from __future__ import annotations

from typing import Any, Dict

from explain_this_repo.providers.base import LLMProvider, LLMProviderError


class GroqProvider(LLMProvider):
    name = "groq"

    def __init__(self, config: Dict[str, Any]) -> None:
        self.config = config
        self.api_key = config.get("api_key")
        self.model = config.get("model")
        self._client = None

        self.validate_config()

    def validate_config(self) -> None:
        if not self.api_key or not str(self.api_key).strip():
            raise LLMProviderError(
                "Groq provider requires an API key.\n"
                "Run `explainthisrepo init` or set providers.groq.api_key."
            )

        if not self.model or not str(self.model).strip():
            raise LLMProviderError(
                "Groq provider requires a model.\n"
                "Set providers.groq.model (e.g. llama3-70b-8192, mixtral-8x7b, deepseek-r1-distill-llama-70b)."
            )

    def _get_client(self):
        if self._client is not None:
            return self._client

        try:
            from groq import Groq
        except ImportError as e:
            raise LLMProviderError(
                "Groq support is not installed.\n"
                "Install it with:\n"
                '  pip install "explainthisrepo[groq]"'
            ) from e

        self._client = Groq(api_key=self.api_key)
        return self._client

    def generate(self, prompt: str) -> str:
        client = self._get_client()

        try:
            response = client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
            )
        except Exception as e:
            raise LLMProviderError(f"Groq request failed: {e}") from e

        try:
            text = response.choices[0].message.content
        except Exception:
            text = None

        if not text or not text.strip():
            raise LLMProviderError("Groq returned no text")

        return text.strip()

    def doctor(self) -> list[str]:
        return [
            f"GROQ_API_KEY set: {bool(self.api_key)}",
            f"model: {self.model}",
        ]
