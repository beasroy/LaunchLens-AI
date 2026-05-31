import { getServerSession } from "next-auth";

import { IdeasView, type IdeaListItem } from "@/components/ideas/ideas-view";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function IdeasPage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user!.id;

  const ideas = await prisma.idea.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: {
      analyses: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { validationScore: true },
      },
    },
  });

  const serialized: IdeaListItem[] = ideas.map((idea) => ({
    id: idea.id,
    title: idea.title,
    description: idea.description,
    industry: idea.industry,
    targetAudience: idea.targetAudience,
    primaryTargetMarket: idea.primaryTargetMarket,
    createdAt: idea.createdAt.toISOString(),
    updatedAt: idea.updatedAt.toISOString(),
    latestScore: idea.analyses[0]?.validationScore ?? null,
  }));

  return <IdeasView ideas={serialized} />;
}
