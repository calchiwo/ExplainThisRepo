from explain_this_repo.providers.registry import get_active_provider

def generate_explanation(prompt: str) -> str:

    provider = get_active_provider()

    try:
        output = provider.generate(prompt)
    except Exception as e:
        raise RuntimeError(f"{provider.name} generation failed: {e}") from e

    if not output or not output.strip():
        raise RuntimeError(f"{provider.name} returned no output")

    return output.strip()