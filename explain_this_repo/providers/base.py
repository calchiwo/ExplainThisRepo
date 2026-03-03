from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any, Dict


class LLMProviderError(RuntimeError):
    pass


class LLMProvider(ABC):

    name: str

    def __init__(self, config: Dict[str, Any] | None = None) -> None:
        self.config = config or {}
        self.validate_config()

    @abstractmethod
    def validate_config(self) -> None:

        raise NotImplementedError

    @abstractmethod
    def generate(self, prompt: str) -> str:

        raise NotImplementedError
