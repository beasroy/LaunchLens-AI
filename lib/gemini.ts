import { GoogleGenAI } from "@google/genai";

function getGeminiApiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error(
      "GEMINI_API_KEY is not set. Add it to your .env file to run AI analysis."
    );
  }
  return key;
}

export const ANALYSIS_MODEL = "gemini-2.5-flash";

export function createGeminiClient() {
  return new GoogleGenAI({ apiKey: getGeminiApiKey() });
}
