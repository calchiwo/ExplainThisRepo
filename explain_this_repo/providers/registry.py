from __future__ import annotations

from typing import Dict, Type

from explain_this_repo.config import load_config
from explain_this_repo.providers.base import LLMProvider, LLMProviderError

_PROVIDER_REGISTRY: Dict[str, str] = {
    "gemini": "explain_this_repo.providers.gemini.GeminiProvider",
    "openai": "explain_this_repo.providers.openai.OpenAIProvider",
    "ollama": "explain_this_repo.providers.ollama.OllamaProvider",
    "anthropic": "explain_this_repo.providers.anthropic.AnthropicProvider",
    "groq": "explain_this_repo.providers.groq.GroqProvider",
    "openrouter": "explain_this_repo.providers.openrouter.OpenRouterProvider",
}


def list_providers() -> list[str]:
    return list(_PROVIDER_REGISTRY.keys())


def _import_provider_class(path: str) -> Type[LLMProvider]:
    module_path, class_name = path.rsplit(".", 1)
    module = __import__(module_path, fromlist=[class_name])
    provider_cls = getattr(module, class_name)
    return provider_cls


def get_provider(name: str) -> LLMProvider:
    name = name.lower()

    if name not in _PROVIDER_REGISTRY:
        raise LLMProviderError(
            f"Unknown LLM provider '{name}'. "
            f"Available providers: {', '.join(sorted(_PROVIDER_REGISTRY.keys()))}"
        )

    config = load_config() or {}

    provider_config = config.get("providers", {}).get(name, {})

    provider_path = _PROVIDER_REGISTRY[name]
    provider_cls = _import_provider_class(provider_path)

    return provider_cls(provider_config)


def get_active_provider(
    override: str | None = None,
) -> LLMProvider:

    if override:
        return get_provider(override)

    config = load_config() or {}

    default_provider = config.get("llm", {}).get("provider")

    if not default_provider:
        raise LLMProviderError(
            "No LLM provider configured.\n"
            "Run `explainthisrepo init` to configure a provider."
        )

    return get_provider(default_provider)
