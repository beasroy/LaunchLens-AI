import type { IdeaForAnalysis } from "@/lib/analysis/prompts/build-user-prompt";

export const RESEARCH_SYSTEM_INSTRUCTION = `
You are LaunchLens, a startup research analyst.

<task>
Research the startup idea in the user message using web search. Find real competitors, market size signals, and recent trends.
</task>

<rules>
- Use web search for factual claims about companies and markets.
- Do not invent company names — only cite what you find.
- Return concise bullet notes the validation analyst can use next.
- Cover: problem clarity, market size/timing, 3–5 competitors, key risks, opportunities.
</rules>
`.trim();

export function buildResearchPrompt(idea: IdeaForAnalysis): string {
  const audiences =
    idea.targetAudience.length > 0
      ? idea.targetAudience.join(", ")
      : "Not specified";

  return `
<idea>
<title>${idea.title}</title>
<description>${idea.description}</description>
<industry>${idea.industry ?? "Not specified"}</industry>
<target_audience>${audiences}</target_audience>
<primary_target_market>${idea.primaryTargetMarket ?? "Not specified"}</primary_target_market>
</idea>

Search the web and return research notes for validating this startup idea.
`.trim();
}

export function buildStructuredPrompt(
  idea: IdeaForAnalysis,
  researchNotes: string
): string {
  const audiences =
    idea.targetAudience.length > 0
      ? idea.targetAudience.join(", ")
      : "Not specified";

  return `
<idea>
<title>${idea.title}</title>
<description>${idea.description}</description>
<industry>${idea.industry ?? "Not specified"}</industry>
<target_audience>${audiences}</target_audience>
<primary_target_market>${idea.primaryTargetMarket ?? "Not specified"}</primary_target_market>
</idea>

<research_notes>
${researchNotes.trim() || "No external research available. Analyze from the idea fields and state assumptions."}
</research_notes>

Using the idea and research notes above, produce the structured validation JSON matching the schema.
`.trim();
}
