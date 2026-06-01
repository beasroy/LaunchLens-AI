import {
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  Shield,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type {
  AnalysisResult,
  MvpPriority,
  RiskSeverity,
} from "@/lib/analysis/schema";
import { cn } from "@/lib/utils";

export type SerializedAnalysis = {
  id: string;
  validationScore: number | null;
  problemStatement: string | null;
  marketPotential: string | null;
  risks: AnalysisResult["risks"] | null;
  opportunities: AnalysisResult["opportunities"] | null;
  competitors: AnalysisResult["competitors"] | null;
  mvpFeatures: AnalysisResult["mvpFeatures"] | null;
  createdAt: string;
};

type AnalysisResultsProps = {
  analyses: SerializedAnalysis[];
};

function getScoreTone(score: number) {
  if (score >= 75) {
    return {
      badge: "bg-emerald-50 text-emerald-700 ring-emerald-200/60",
      bar: "from-emerald-400 to-teal-500",
    };
  }
  if (score >= 50) {
    return {
      badge: "bg-amber-50 text-amber-700 ring-amber-200/60",
      bar: "from-amber-400 to-orange-500",
    };
  }
  return {
    badge: "bg-rose-50 text-rose-700 ring-rose-200/60",
    bar: "from-rose-400 to-pink-500",
  };
}

function severityTone(severity: RiskSeverity) {
  switch (severity) {
    case "high":
      return "bg-rose-50 text-rose-700 ring-rose-200/60";
    case "medium":
      return "bg-amber-50 text-amber-700 ring-amber-200/60";
    default:
      return "bg-slate-50 text-slate-600 ring-slate-200/60";
  }
}

function priorityLabel(priority: MvpPriority) {
  return priority === "must_have" ? "Must have" : "Nice to have";
}

function AnalysisCard({ analysis }: { analysis: SerializedAnalysis }) {
  const score = analysis.validationScore ?? 0;
  const tone = getScoreTone(score);
  const risks = analysis.risks ?? [];
  const opportunities = analysis.opportunities ?? [];
  const competitors = analysis.competitors ?? [];
  const mvpFeatures = analysis.mvpFeatures ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <div
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-inset",
            tone.badge
          )}
        >
          <TrendingUp className="size-4" />
          Validation score: {score}/100
        </div>
        <span className="text-sm text-muted-foreground">
          {new Date(analysis.createdAt).toLocaleString("en-IN")}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-indigo-100/80">
        <div
          className={cn("h-full rounded-full bg-gradient-to-r", tone.bar)}
          style={{ width: `${Math.min(score, 100)}%` }}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-indigo-100/80 bg-white/90 gemini-card-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="size-5 text-indigo-600" />
              Problem statement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed text-muted-foreground">
              {analysis.problemStatement}
            </p>
          </CardContent>
        </Card>

        <Card className="border-indigo-100/80 bg-white/90 gemini-card-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="size-5 text-indigo-600" />
              Market potential
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed text-muted-foreground">
              {analysis.marketPotential}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-indigo-100/80 bg-white/90">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="size-5 text-amber-600" />
              Risks
            </CardTitle>
            <CardDescription>What could limit success</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {risks.map((risk) => (
              <div
                key={risk.title}
                className="rounded-xl border border-indigo-50 bg-indigo-50/30 p-4"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="font-medium text-foreground">{risk.title}</span>
                  <Badge
                    variant="outline"
                    className={cn("text-xs", severityTone(risk.severity))}
                  >
                    {risk.severity}
                  </Badge>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {risk.description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-indigo-100/80 bg-white/90">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lightbulb className="size-5 text-emerald-600" />
              Opportunities
            </CardTitle>
            <CardDescription>Where to focus next</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {opportunities.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-indigo-50 bg-indigo-50/30 p-4"
              >
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-indigo-100/80 bg-white/90">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="size-5 text-indigo-600" />
            Competitors
          </CardTitle>
          <CardDescription>Landscape from web research</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {competitors.map((competitor) => (
            <div
              key={competitor.name}
              className="rounded-xl border border-indigo-50 bg-indigo-50/30 p-4"
            >
              <p className="font-semibold text-foreground">{competitor.name}</p>
              <p className="mt-2 text-sm">
                <span className="font-medium text-emerald-700">Strengths: </span>
                <span className="text-muted-foreground">{competitor.strengths}</span>
              </p>
              <p className="mt-1 text-sm">
                <span className="font-medium text-rose-700">Weaknesses: </span>
                <span className="text-muted-foreground">{competitor.weaknesses}</span>
              </p>
              {competitor.differentiator ? (
                <p className="mt-1 text-sm">
                  <span className="font-medium text-indigo-700">Your edge: </span>
                  <span className="text-muted-foreground">
                    {competitor.differentiator}
                  </span>
                </p>
              ) : null}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-indigo-100/80 bg-white/90">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CheckCircle2 className="size-5 text-indigo-600" />
            MVP features
          </CardTitle>
          <CardDescription>Recommended first version</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {mvpFeatures.map((feature) => (
            <div
              key={feature.feature}
              className="flex flex-col gap-2 rounded-xl border border-indigo-50 bg-indigo-50/30 p-4 sm:flex-row sm:items-start sm:justify-between"
            >
              <div>
                <p className="font-medium text-foreground">{feature.feature}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {feature.rationale}
                </p>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "shrink-0 self-start",
                  feature.priority === "must_have"
                    ? "bg-indigo-50 text-indigo-700 ring-indigo-200/60"
                    : "bg-slate-50 text-slate-600 ring-slate-200/60"
                )}
              >
                {priorityLabel(feature.priority)}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export function AnalysisResults({ analyses }: AnalysisResultsProps) {
  if (analyses.length === 0) return null;

  const [latest, ...history] = analyses;

  return (
    <div className="mt-10 space-y-8">
      <div className="flex items-center gap-2">
        <Shield className="size-5 text-indigo-600" />
        <h2 className="text-xl font-semibold">Latest validation</h2>
      </div>
      <AnalysisCard analysis={latest} />

      {history.length > 0 ? (
        <details className="rounded-2xl border border-indigo-100 bg-white/60 p-4">
          <summary className="cursor-pointer text-sm font-medium text-indigo-700">
            Previous analyses ({history.length})
          </summary>
          <div className="mt-6 space-y-10 border-t border-indigo-100 pt-6">
            {history.map((analysis) => (
              <AnalysisCard key={analysis.id} analysis={analysis} />
            ))}
          </div>
        </details>
      ) : null}
    </div>
  );
}
