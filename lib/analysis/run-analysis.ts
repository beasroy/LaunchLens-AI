import type { GenerateContentResponse } from "@google/genai";

import {
  buildResearchPrompt,
  buildStructuredPrompt,
  RESEARCH_SYSTEM_INSTRUCTION,
} from "@/lib/analysis/prompts/build-structured-prompt";
import type { IdeaForAnalysis } from "@/lib/analysis/prompts/build-user-prompt";
import { ANALYSIS_SYSTEM_INSTRUCTION } from "@/lib/analysis/prompts/system";
import {
  analysisGeminiSchema,
  parseAnalysisResult,
  toPrismaAnalysisData,
  type AnalysisResult,
} from "@/lib/analysis/schema";
import { ANALYSIS_MODEL, createGeminiClient } from "@/lib/gemini";

export type AnalysisStreamEvent =
  | { type: "status"; phase: "searching" | "generating" | "saving" }
  | { type: "delta"; text: string }
  | { type: "sources"; queries: string[]; titles: string[] }
  | { type: "complete"; result: AnalysisResult; sources: AnalysisSources }
  | { type: "error"; message: string };

export type AnalysisSources = {
  queries: string[];
  titles: string[];
};

export type AnalysisRunResult = {
  result: AnalysisResult;
  prismaData: ReturnType<typeof toPrismaAnalysisData>;
  sources: AnalysisSources;
};

function extractSources(response: GenerateContentResponse): AnalysisSources {
  const metadata = response.candidates?.[0]?.groundingMetadata;
  const queries = metadata?.webSearchQueries ?? [];
  const titles =
    metadata?.groundingChunks
      ?.map((chunk) => chunk.web?.title)
      .filter((title): title is string => Boolean(title)) ?? [];

  return { queries, titles };
}

function mergeSources(
  current: AnalysisSources,
  next: AnalysisSources
): AnalysisSources {
  return {
    queries: [...new Set([...current.queries, ...next.queries])],
    titles: [...new Set([...current.titles, ...next.titles])],
  };
}

export async function* streamAnalysis(
  idea: IdeaForAnalysis
): AsyncGenerator<AnalysisStreamEvent> {
  const gemini = createGeminiClient();

  yield { type: "status", phase: "searching" };

  let sources: AnalysisSources = { queries: [], titles: [] };
  let researchNotes = "";
  let accumulatedText = "";

  try {
    const researchStream = await gemini.models.generateContentStream({
      model: ANALYSIS_MODEL,
      contents: buildResearchPrompt(idea),
      config: {
        systemInstruction: RESEARCH_SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 0 },
      },
    });

    for await (const chunk of researchStream) {
      sources = mergeSources(sources, extractSources(chunk));
      const delta = chunk.text ?? "";
      if (delta) {
        researchNotes += delta;
        yield { type: "delta", text: researchNotes };
      }

      if (sources.queries.length > 0 || sources.titles.length > 0) {
        yield { type: "sources", ...sources };
      }
    }

    yield { type: "status", phase: "generating" };
    accumulatedText = "";

    const analysisStream = await gemini.models.generateContentStream({
      model: ANALYSIS_MODEL,
      contents: buildStructuredPrompt(idea, researchNotes),
      config: {
        systemInstruction: ANALYSIS_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseJsonSchema: analysisGeminiSchema,
        thinkingConfig: { thinkingBudget: 0 },
      },
    });

    for await (const chunk of analysisStream) {
      const delta = chunk.text ?? "";
      if (delta) {
        accumulatedText += delta;
        yield { type: "delta", text: accumulatedText };
      }
    }

    yield { type: "status", phase: "saving" };

    const parsed = parseAnalysisResult(JSON.parse(accumulatedText));

    yield {
      type: "complete",
      result: parsed,
      sources,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Analysis failed unexpectedly.";
    yield { type: "error", message };
  }
}

export function toAnalysisRunResult(
  result: AnalysisResult,
  sources: AnalysisSources
): AnalysisRunResult {
  return {
    result,
    prismaData: toPrismaAnalysisData(result),
    sources,
  };
}
