import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  throw new Error("GEMINI_API_KEY is not set");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const MODEL = "gemini-2.5-flash-lite";

export async function generateExplanation(prompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: MODEL });
  const result = await model.generateContent(prompt);
  const response = result.response;

  if (!response || !response.text()) {
    throw new Error("Gemini returned no text");
  }

  return response.text().trim();
}
