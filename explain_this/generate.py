#explain_this/generate.py
import os
import google.generativeai as genai

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise RuntimeError("GEMINI_API_KEY is not set")

genai.configure(api_key=API_KEY)

model = genai.GenerativeModel("gemini-1.5-flash")


def generate_explanation(prompt: str) -> str:
    response = model.generate_content(prompt)

    if not response.text:
        raise RuntimeError("Gemini returned no text")

    return response.text.strip()
