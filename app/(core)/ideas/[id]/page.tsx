import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { ArrowLeft } from "lucide-react";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function IdeaDetailPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  const userId = session!.user!.id;
  const { id } = await params;

  const idea = await prisma.idea.findFirst({
    where: { id, userId },
    include: {
      analyses: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!idea) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <header className="border-b border-indigo-100/60 bg-white/50 px-6 py-8 backdrop-blur-sm lg:px-10">
        <Link
          href="/ideas"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-indigo-700"
        >
          <ArrowLeft className="size-4" />
          Back to ideas
        </Link>
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
          <span className="gemini-gradient-text">{idea.title}</span>
        </h1>
      </header>

      <div className="flex-1 px-6 py-8 lg:px-10">
        <div className="max-w-4xl">
          <p className="text-lg leading-relaxed whitespace-pre-wrap text-muted-foreground">
            {idea.description}
          </p>
          {idea.analyses.length === 0 ? (
            <p className="mt-10 rounded-2xl border border-dashed border-indigo-200 bg-white/80 p-8 text-center text-muted-foreground">
              AI analysis coming soon — run validation from this page.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
