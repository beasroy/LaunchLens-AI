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

export type AnalysisModelConfig = {
  id: string;
  label: string;
};



export const ANALYSIS_MODEL_CHAIN: AnalysisModelConfig[] = [
  { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
  { id: "gemini-2.5-flash-lite", label: "Gemini 2.5 Flash Lite" },
  { id: "gemini-2.0-flash", label: "Gemini 2.0 Flash" },
  { id: "gemini-2.0-flash-lite", label: "Gemini 2.0 Flash Lite" },
];

export const ANALYSIS_MODEL = ANALYSIS_MODEL_CHAIN[0].id;

export function createGeminiClient() {
  return new GoogleGenAI({ apiKey: getGeminiApiKey() });
}
