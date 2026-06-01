import type { GenerateContentResponse, GoogleGenAI } from "@google/genai";

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
import {
  formatAnalysisError,
  shouldFallbackToNextModel,
} from "@/lib/analysis/model-errors";
import {
  ANALYSIS_MODEL_CHAIN,
  type AnalysisModelConfig,
  createGeminiClient,
} from "@/lib/gemini";

export type AnalysisStreamEvent =
  | { type: "status"; phase: "searching" | "generating" | "saving" }
  | { type: "model"; modelId: string; label: string; isFallback: boolean }
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

async function* streamResearchPhase(
  gemini: GoogleGenAI,
  model: AnalysisModelConfig,
  idea: IdeaForAnalysis
): AsyncGenerator<
  | { kind: "delta"; text: string }
  | { kind: "sources"; sources: AnalysisSources }
> {
  const researchStream = await gemini.models.generateContentStream({
    model: model.id,
    contents: buildResearchPrompt(idea),
    config: {
      systemInstruction: RESEARCH_SYSTEM_INSTRUCTION,
      tools: [{ googleSearch: {} }],
      thinkingConfig: { thinkingBudget: 0 },
    },
  });

  let sources: AnalysisSources = { queries: [], titles: [] };
  let researchNotes = "";

  for await (const chunk of researchStream) {
    sources = mergeSources(sources, extractSources(chunk));
    const delta = chunk.text ?? "";
    if (delta) {
      researchNotes += delta;
      yield { kind: "delta", text: researchNotes };
    }

    if (sources.queries.length > 0 || sources.titles.length > 0) {
      yield { kind: "sources", sources };
    }
  }

  return researchNotes;
}

async function* streamStructuredPhase(
  gemini: GoogleGenAI,
  model: AnalysisModelConfig,
  idea: IdeaForAnalysis,
  researchNotes: string
): AsyncGenerator<{ kind: "delta"; text: string }> {
  const analysisStream = await gemini.models.generateContentStream({
    model: model.id,
    contents: buildStructuredPrompt(idea, researchNotes),
    config: {
      systemInstruction: ANALYSIS_SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseJsonSchema: analysisGeminiSchema,
      thinkingConfig: { thinkingBudget: 0 },
    },
  });

  let accumulatedText = "";

  for await (const chunk of analysisStream) {
    const delta = chunk.text ?? "";
    if (delta) {
      accumulatedText += delta;
      yield { kind: "delta", text: accumulatedText };
    }
  }

  return accumulatedText;
}

export async function* streamAnalysis(
  idea: IdeaForAnalysis
): AsyncGenerator<AnalysisStreamEvent> {
  const gemini = createGeminiClient();

  for (let modelIndex = 0; modelIndex < ANALYSIS_MODEL_CHAIN.length; modelIndex++) {
    const model = ANALYSIS_MODEL_CHAIN[modelIndex];
    const isFallback = modelIndex > 0;

    yield {
      type: "model",
      modelId: model.id,
      label: model.label,
      isFallback,
    };

    yield { type: "status", phase: "searching" };

    let sources: AnalysisSources = { queries: [], titles: [] };
    let researchNotes = "";
    let accumulatedText = "";

    try {
      const researchGen = streamResearchPhase(gemini, model, idea);
      let researchResult = await researchGen.next();

      while (!researchResult.done) {
        const event = researchResult.value;
        if (event.kind === "delta") {
          researchNotes = event.text;
          yield { type: "delta", text: researchNotes };
        } else if (event.kind === "sources") {
          sources = event.sources;
          yield { type: "sources", ...sources };
        }
        researchResult = await researchGen.next();
      }

      researchNotes = researchResult.value ?? researchNotes;

      yield { type: "status", phase: "generating" };
      accumulatedText = "";

      const structuredGen = streamStructuredPhase(
        gemini,
        model,
        idea,
        researchNotes
      );
      let structuredResult = await structuredGen.next();

      while (!structuredResult.done) {
        const event = structuredResult.value;
        accumulatedText = event.text;
        yield { type: "delta", text: accumulatedText };
        structuredResult = await structuredGen.next();
      }

      accumulatedText = structuredResult.value ?? accumulatedText;

      yield { type: "status", phase: "saving" };

      const parsed = parseAnalysisResult(JSON.parse(accumulatedText));

      yield {
        type: "complete",
        result: parsed,
        sources,
      };
      return;
    } catch (error) {
      const hasAnotherModel = modelIndex < ANALYSIS_MODEL_CHAIN.length - 1;

      if (shouldFallbackToNextModel(error) && hasAnotherModel) {
        continue;
      }

      yield {
        type: "error",
        message: formatAnalysisError(error, { allModelsTried: true }),
      };
      return;
    }
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
