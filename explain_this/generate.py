import os
from google import genai

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is not set")

client = genai.Client(api_key=GEMINI_API_KEY)

MODEL = "gemini-1.5-flash"


def generate_explanation(prompt: str) -> str:
    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=prompt,
        )
    except Exception as e:
        raise RuntimeError(f"Gemini request failed: {e}")

    if not response or not response.text:
        raise RuntimeError("Gemini returned no text")

    return response.text.strip()
