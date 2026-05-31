import { Type } from "@google/genai";
import { z } from "zod";

const riskSeveritySchema = z.enum(["low", "medium", "high"]);
const mvpPrioritySchema = z.enum(["must_have", "nice_to_have"]);

export const analysisResultSchema = z.object({
  validationScore: z
    .number()
    .int()
    .min(0)
    .max(100)
    .describe("Overall validation score from 0 (weak) to 100 (strong)."),
  problemStatement: z
    .string()
    .min(1)
    .describe("Clear articulation of the core problem this idea solves."),
  marketPotential: z
    .string()
    .min(1)
    .describe("Assessment of market size, timing, and growth potential."),
  risks: z
    .array(
      z.object({
        title: z.string().min(1),
        severity: riskSeveritySchema,
        description: z.string().min(1),
      })
    )
    .min(1)
    .max(8)
    .describe("Key risks that could limit success."),
  opportunities: z
    .array(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
      })
    )
    .min(1)
    .max(8)
    .describe("Actionable opportunities to pursue."),
  competitors: z
    .array(
      z.object({
        name: z.string().min(1),
        strengths: z.string().min(1),
        weaknesses: z.string().min(1),
        differentiator: z.string().optional(),
      })
    )
    .min(1)
    .max(8)
    .describe("Real or likely competitors found via web search."),
  mvpFeatures: z
    .array(
      z.object({
        feature: z.string().min(1),
        priority: mvpPrioritySchema,
        rationale: z.string().min(1),
      })
    )
    .min(1)
    .max(10)
    .describe("Recommended MVP feature set with priorities."),
});

export type AnalysisResult = z.infer<typeof analysisResultSchema>;
export type RiskSeverity = z.infer<typeof riskSeveritySchema>;
export type MvpPriority = z.infer<typeof mvpPrioritySchema>;

export function parseAnalysisResult(raw: unknown): AnalysisResult {
  return analysisResultSchema.parse(raw);
}

export function toPrismaAnalysisData(result: AnalysisResult) {
  return {
    validationScore: result.validationScore,
    problemStatement: result.problemStatement,
    marketPotential: result.marketPotential,
    risks: result.risks,
    opportunities: result.opportunities,
    competitors: result.competitors,
    mvpFeatures: result.mvpFeatures,
  };
}

export const analysisGeminiSchema = {
  type: Type.OBJECT,
  propertyOrdering: [
    "validationScore",
    "problemStatement",
    "marketPotential",
    "risks",
    "opportunities",
    "competitors",
    "mvpFeatures",
  ],
  properties: {
    validationScore: {
      type: Type.INTEGER,
      description:
        "Overall validation score from 0 (weak) to 100 (strong).",
    },
    problemStatement: {
      type: Type.STRING,
      description:
        "Clear articulation of the core problem this idea solves.",
    },
    marketPotential: {
      type: Type.STRING,
      description: "Assessment of market size, timing, and growth potential.",
    },
    risks: {
      type: Type.ARRAY,
      description: "Key risks that could limit success.",
      items: {
        type: Type.OBJECT,
        propertyOrdering: ["title", "severity", "description"],
        properties: {
          title: { type: Type.STRING },
          severity: {
            type: Type.STRING,
            description: "One of: low, medium, high.",
          },
          description: { type: Type.STRING },
        },
        required: ["title", "severity", "description"],
      },
    },
    opportunities: {
      type: Type.ARRAY,
      description: "Actionable opportunities to pursue.",
      items: {
        type: Type.OBJECT,
        propertyOrdering: ["title", "description"],
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ["title", "description"],
      },
    },
    competitors: {
      type: Type.ARRAY,
      description: "Real or likely competitors found via web search.",
      items: {
        type: Type.OBJECT,
        propertyOrdering: [
          "name",
          "strengths",
          "weaknesses",
          "differentiator",
        ],
        properties: {
          name: { type: Type.STRING },
          strengths: { type: Type.STRING },
          weaknesses: { type: Type.STRING },
          differentiator: { type: Type.STRING },
        },
        required: ["name", "strengths", "weaknesses"],
      },
    },
    mvpFeatures: {
      type: Type.ARRAY,
      description: "Recommended MVP feature set with priorities.",
      items: {
        type: Type.OBJECT,
        propertyOrdering: ["feature", "priority", "rationale"],
        properties: {
          feature: { type: Type.STRING },
          priority: {
            type: Type.STRING,
            description: "One of: must_have, nice_to_have.",
          },
          rationale: { type: Type.STRING },
        },
        required: ["feature", "priority", "rationale"],
      },
    },
  },
  required: [
    "validationScore",
    "problemStatement",
    "marketPotential",
    "risks",
    "opportunities",
    "competitors",
    "mvpFeatures",
  ],
};

export const analysisSchemas = {
  result: analysisResultSchema,
};
