export type IdeaForAnalysis = {
  title: string;
  description: string;
  industry: string | null;
  targetAudience: string[];
  primaryTargetMarket: string | null;
};

export function buildUserPrompt(idea: IdeaForAnalysis): string {
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

Analyze this startup idea. Search the web for competitors and market context. Return structured JSON matching the schema.
`.trim();
}
