from openai import OpenAI

client = OpenAI()


def generate_explanation(prompt: str) -> str:
    response = client.responses.create(
        model="gpt-4.1-mini",
        input=prompt,
    )

    # Safely extract text from the response
    output_parts = []

    for item in response.output:
        if item["type"] == "message":
            for content in item["content"]:
                if content["type"] == "output_text":
                    output_parts.append(content["text"])

    if not output_parts:
        raise RuntimeError("LLM returned no text output")

    return "\n".join(output_parts).strip()

