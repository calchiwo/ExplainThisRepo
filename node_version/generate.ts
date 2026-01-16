import { GoogleGenerativeAI } from "@google/generative-ai";

const DEFAULT_MODEL = "gemini-2.5-flash-lite";

function getApiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key || !key.trim()) {
    throw new Error(
      [
        "GEMINI_API_KEY is not set.",
        "",
        "Fix:",
        '  export GEMINI_API_KEY="your_key_here"',
      ].join("\n"),
    );
  }
  return key.trim();
}

export async function generateExplanation(prompt: string): Promise<string> {
  const apiKey = getApiKey();
  const genAI = new GoogleGenerativeAI(apiKey);

  const modelName = (process.env.GEMINI_MODEL || DEFAULT_MODEL).trim();
  const model = genAI.getGenerativeModel({ model: modelName });

  try {
    const result = await model.generateContent(prompt);
    const text = result?.response?.text?.() ?? "";

    if (!text.trim()) {
      throw new Error("Gemini returned no text");
    }

    return text.trim();
  } catch (err: any) {
    const msg = err?.message ? String(err.message) : String(err);

    throw new Error(
      [
        "Failed to generate explanation (Gemini).",
        `Model: ${modelName}`,
        `Error: ${msg}`,
      ].join("\n"),
    );
  }
}