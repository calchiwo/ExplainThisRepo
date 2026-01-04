import os
import requests

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError(
        "GEMINI_API_KEY is not set. "
        "Create one in Google AI Studio and export it."
    )

GEMINI_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    "gemini-pro:generateContent"
)

HEADERS = {
    "Content-Type": "application/json",
    "User-Agent": "explain-this-cli/0.1",
}


def generate_explanation(prompt: str) -> str:
    # Gemini will silently drop large prompts
    prompt = prompt[:8000]

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ]
    }

    try:
        response = requests.post(
            f"{GEMINI_URL}?key={GEMINI_API_KEY}",
            headers=HEADERS,
            json=payload,
            timeout=30,
        )
    except requests.RequestException as e:
        raise RuntimeError(f"Gemini request failed: {e}")

    if response.status_code != 200:
        raise RuntimeError(
            f"Gemini API failed: {response.status_code} {response.text}"
        )

    data = response.json()

    try:
        text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
        if not text:
            raise RuntimeError("Gemini returned empty text")
        return text
    except (KeyError, IndexError):
        raise RuntimeError("Gemini returned no usable text")
