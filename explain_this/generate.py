# explain_this/generate.py

import os
from google import genai

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise RuntimeError("GEMINI_API_KEY is not set")

client = genai.Client(api_key=API_KEY)

MODEL = "gemini-1.5-flash"  # THIS works in AI Studio


def generate_explanation(prompt: str) -> str:
    response = client.models.generate_content(
        model=MODEL,
        contents=prompt,
    )

    if not response or not response.text:
        raise RuntimeError("Gemini returned no text")

    return response.text.strip()
