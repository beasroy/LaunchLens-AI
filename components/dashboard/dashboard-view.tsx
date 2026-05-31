"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock,
  Lightbulb,
  Plus,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { IdeaModal } from "@/components/ideas/idea-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getScoreTone } from "@/lib/idea-scores";
import { cn } from "@/lib/utils";

export type DashboardIdea = {
  id: string;
  title: string;
  industry: string | null;
  latestScore: number | null;
  problemStatement: string | null;
  updatedAt: string;
};

export type DashboardStats = {
  totalIdeas: number;
  validatedCount: number;
  pendingCount: number;
  averageScore: number | null;
  scoreBreakdown: {
    strong: number;
    moderate: number;
    weak: number;
  };
};

type DashboardViewProps = {
  ideas: DashboardIdea[];
  topIdeas: DashboardIdea[];
  pendingIdeas: DashboardIdea[];
  stats: DashboardStats;
};

export function DashboardView({
  ideas,
  topIdeas,
  pendingIdeas,
  stats,
}: DashboardViewProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const isEmpty = ideas.length === 0;

  if (isEmpty) {
    return (
      <>
        <div className="flex min-h-[calc(100vh-14rem)] w-full max-w-5xl items-center justify-center">
          <Card
            className={cn(
              "w-full max-w-2xl border-dashed border-indigo-200/80 bg-white/90 py-16 px-8 text-center gemini-card-glow",
              "backdrop-blur-sm"
            )}
          >
            <CardHeader className="flex flex-col items-center justify-center gap-4">
              <span className="flex size-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-100 via-purple-50 to-rose-50">
                <Lightbulb className="size-10 text-indigo-600" />
              </span>
              <CardTitle className="text-2xl font-semibold">
                Start validating ideas
              </CardTitle>
              <CardDescription className="max-w-md text-base leading-relaxed">
                Add your first startup concept and run AI validation — risks,
                competitors, market potential, and MVP paths.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-3 pt-2 sm:flex-row sm:justify-center">
              <Button
                type="button"
                size="lg"
                className="h-12 rounded-xl px-8 text-base gemini-btn-gradient"
                onClick={() => setModalOpen(true)}
              >
                <Sparkles className="size-5" />
                Add your first idea
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="h-12 rounded-xl px-6"
                asChild
              >
                <Link href="/ideas">Browse ideas workspace</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <IdeaModal open={modalOpen} onOpenChange={setModalOpen} />
      </>
    );
  }

  return (
    <>
      <div className="mx-auto flex w-full flex-col gap-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              className="rounded-xl gemini-btn-gradient"
              onClick={() => setModalOpen(true)}
            >
              <Plus className="size-4" />
              New idea
            </Button>
            <Button type="button" variant="outline" className="rounded-xl" asChild>
              <Link href="/ideas">View all ideas</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total ideas"
            value={stats.totalIdeas}
            icon={Lightbulb}
          />
          <StatCard
            label="Validated"
            value={stats.validatedCount}
            icon={CheckCircle2}
            accent="text-emerald-600"
          />
          <StatCard
            label="Awaiting validation"
            value={stats.pendingCount}
            icon={Clock}
            accent="text-amber-600"
          />
          <StatCard
            label="Average score"
            value={stats.averageScore != null ? `${stats.averageScore}` : "—"}
            icon={TrendingUp}
            suffix={stats.averageScore != null ? "/100" : undefined}
          />
        </div>

        {pendingIdeas.length > 0 ? (
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Needs validation</h2>
              <p className="text-sm text-muted-foreground">
                These ideas haven&apos;t been analyzed yet.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {pendingIdeas.map((idea) => (
                <Card
                  key={idea.id}
                  className="border-dashed border-indigo-200/80 bg-white/90"
                >
                  <CardContent className="flex items-center justify-between gap-4 pt-6">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{idea.title}</p>
                      {idea.industry ? (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {idea.industry}
                        </p>
                      ) : null}
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      className="shrink-0 rounded-lg gemini-btn-gradient"
                      asChild
                    >
                      <Link href={`/ideas/${idea.id}`}>Validate</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="space-y-4 lg:col-span-2">
            <div>
              <h2 className="text-lg font-semibold">Top ideas by score</h2>
              <p className="text-sm text-muted-foreground">
                Your highest-rated validations.
              </p>
            </div>

            {topIdeas.length > 0 ? (
              <div className="flex flex-col gap-4">
                {topIdeas.map((idea, index) => (
                  <TopIdeaCard key={idea.id} idea={idea} rank={index + 1} />
                ))}
              </div>
            ) : (
              <Card className="border-dashed border-indigo-200/80 bg-white/80">
                <CardContent className="py-10 text-center text-muted-foreground">
                  No validation scores yet. Run analysis on an idea to see
                  rankings here.
                </CardContent>
              </Card>
            )}
          </section>

          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Score breakdown</h2>
              <p className="text-sm text-muted-foreground">
                Portfolio health at a glance.
              </p>
            </div>
            <Card className="border-white/80 bg-white/90 gemini-card-glow">
              <CardHeader className="pb-2">
                <BarChart3 className="size-6 text-indigo-600" />
                <CardTitle className="text-base">Validation tiers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <BreakdownRow
                  label="Strong (75+)"
                  count={stats.scoreBreakdown.strong}
                  total={stats.validatedCount}
                  barClass="from-emerald-400 to-teal-500"
                />
                <BreakdownRow
                  label="Moderate (50–74)"
                  count={stats.scoreBreakdown.moderate}
                  total={stats.validatedCount}
                  barClass="from-amber-400 to-orange-500"
                />
                <BreakdownRow
                  label="Needs work (under 50)"
                  count={stats.scoreBreakdown.weak}
                  total={stats.validatedCount}
                  barClass="from-rose-400 to-pink-500"
                />
              </CardContent>
            </Card>
          </section>
        </div>
      </div>

      <IdeaModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent = "text-indigo-600",
  suffix,
}: {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  accent?: string;
  suffix?: string;
}) {
  return (
    <Card className="border-white/80 bg-white/90 gemini-card-glow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-1 text-3xl font-bold tracking-tight">
              {value}
              {suffix ? (
                <span className="text-lg font-medium text-muted-foreground">
                  {suffix}
                </span>
              ) : null}
            </p>
          </div>
          <Icon className={cn("size-5 shrink-0", accent)} />
        </div>
      </CardContent>
    </Card>
  );
}

function TopIdeaCard({ idea, rank }: { idea: DashboardIdea; rank: number }) {
  const score = idea.latestScore ?? 0;
  const tone = getScoreTone(score);
  const preview = idea.problemStatement
    ? idea.problemStatement.length > 120
      ? `${idea.problemStatement.slice(0, 120)}…`
      : idea.problemStatement
    : null;

  return (
    <Link href={`/ideas/${idea.id}`} className="block">
      <Card className="group border-white/80 bg-white/90 transition-all hover:-translate-y-0.5 hover:border-indigo-200/70 hover:shadow-[0_8px_30px_oklch(0.5_0.12_280_/_0.12)] gemini-card-glow">
        <CardContent className="flex gap-4 pt-6">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 via-purple-50 to-rose-50 text-sm font-bold text-indigo-700 ring-1 ring-indigo-100/80">
            #{rank}
          </span>
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-semibold transition-colors group-hover:text-indigo-950">
                  {idea.title}
                </p>
                {idea.industry ? (
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {idea.industry}
                  </p>
                ) : null}
              </div>
              <Badge
                variant="secondary"
                className={cn("shrink-0 ring-1 ring-inset", tone.badge)}
              >
                {score}/100
              </Badge>
            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-indigo-100/80">
              <div
                className={cn("h-full rounded-full bg-gradient-to-r", tone.bar)}
                style={{ width: `${Math.min(score, 100)}%` }}
              />
            </div>

            {preview ? (
              <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                {preview}
              </p>
            ) : null}

            <span className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 opacity-0 transition-opacity group-hover:opacity-100">
              View analysis
              <ArrowRight className="size-4" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function BreakdownRow({
  label,
  count,
  total,
  barClass,
}: {
  label: string;
  count: number;
  total: number;
  barClass: string;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">
          {count}
          {total > 0 ? ` (${pct}%)` : ""}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-indigo-100/80">
        <div
          className={cn("h-full rounded-full bg-gradient-to-r", barClass)}
          style={{ width: total > 0 ? `${pct}%` : "0%" }}
        />
      </div>
    </div>
  );
}
