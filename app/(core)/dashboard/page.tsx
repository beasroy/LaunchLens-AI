import type { Metadata } from "next";
import { getServerSession } from "next-auth";

import {
  DashboardView,
  type DashboardIdea,
  type DashboardStats,
} from "@/components/dashboard/dashboard-view";
import { authOptions } from "@/lib/auth";
import { getScoreBucket } from "@/lib/idea-scores";
import { createPageMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = createPageMetadata({
  title: "Dashboard",
  description: "Track validation progress and top-scoring startup ideas across your portfolio.",
  path: "/dashboard",
  noIndex: true,
});

function buildDashboardData(
  ideas: Array<{
    id: string;
    title: string;
    industry: string | null;
    updatedAt: Date;
    analyses: Array<{
      validationScore: number | null;
      problemStatement: string | null;
    }>;
  }>
) {
  const serialized: DashboardIdea[] = ideas.map((idea) => ({
    id: idea.id,
    title: idea.title,
    industry: idea.industry,
    latestScore: idea.analyses[0]?.validationScore ?? null,
    problemStatement: idea.analyses[0]?.problemStatement ?? null,
    updatedAt: idea.updatedAt.toISOString(),
  }));

  const validated = serialized.filter((idea) => idea.latestScore != null);
  const pendingIdeas = serialized.filter((idea) => idea.latestScore == null);

  const averageScore =
    validated.length > 0
      ? Math.round(
          validated.reduce((sum, idea) => sum + idea.latestScore!, 0) /
            validated.length
        )
      : null;

  const scoreBreakdown = { strong: 0, moderate: 0, weak: 0 };
  for (const idea of validated) {
    scoreBreakdown[getScoreBucket(idea.latestScore!)]++;
  }

  const topIdeas = [...validated]
    .sort((a, b) => b.latestScore! - a.latestScore!)
    .slice(0, 3);

  const stats: DashboardStats = {
    totalIdeas: serialized.length,
    validatedCount: validated.length,
    pendingCount: pendingIdeas.length,
    averageScore,
    scoreBreakdown,
  };

  return { ideas: serialized, topIdeas, pendingIdeas, stats };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user!.id;

  const ideas = await prisma.idea.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: {
      analyses: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          validationScore: true,
          problemStatement: true,
        },
      },
    },
  });

  const dashboard = buildDashboardData(ideas);

  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <header className="border-b border-indigo-100/60 bg-white/50 px-6 py-8 backdrop-blur-sm lg:px-10">
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
          <span className="gemini-gradient-text">Dashboard</span>
        </h1>
        <p className="mt-2 max-w-2xl text-lg text-muted-foreground">
          Track validation progress across your startup ideas.
        </p>
      </header>

      <div className="flex-1 px-6 py-8 lg:px-10">
        <DashboardView {...dashboard} />
      </div>
    </div>
  );
}
