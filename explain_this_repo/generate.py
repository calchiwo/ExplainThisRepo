import os

MODEL = "gemini-2.5-flash-lite"


def generate_explanation(prompt: str) -> str:
    """
    Generates EXPLAIN.md content using Gemini.
    Requires:
      - google-genai installed
      - GEMINI_API_KEY set
    """

    try:
        from google import genai
    except ImportError:
        raise RuntimeError(
            "Gemini support is not installed.\n"
            "Install it with:\n"
            '  pip install "explainthisrepo[gemini]"\n'
            "or\n"
            "  pip install google-genai"
        )

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY is not set")

    client = genai.Client(api_key=api_key)

    response = client.models.generate_content(
        model=MODEL,
        contents=prompt,
    )

    if not response or not getattr(response, "text", None):
        raise RuntimeError("Gemini returned no text")

    return response.text.strip()