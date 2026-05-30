"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  Lightbulb,
  Plus,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { CreateIdeaModal } from "@/components/ideas/create-idea-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type IdeaListItem = {
  id: string;
  title: string;
  description: string;
  industry: string | null;
  targetAudience: string[];
  createdAt: string;
  updatedAt: string;
  latestScore: number | null;
};

type IdeasViewProps = {
  ideas: IdeaListItem[];
};

export function IdeasView({ ideas }: IdeasViewProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const isEmpty = ideas.length === 0;

  return (
    <>
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="border-b border-indigo-100/60 bg-white/50 px-6 py-8 backdrop-blur-sm lg:px-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                <span className="gemini-gradient-text">Your ideas</span>
              </h1>
              <p className="mt-3 text-lg text-muted-foreground">
                Validate startup concepts with AI-powered analysis — risks,
                competitors, and MVP paths.
              </p>
            </div>
            {!isEmpty ? (
              <Button
                type="button"
                size="lg"
                className="h-11 shrink-0 rounded-xl px-6 gemini-btn-gradient"
                onClick={() => setModalOpen(true)}
              >
                <Plus className="size-5" />
                New idea
              </Button>
            ) : null}
          </div>
        </header>

        <div className="flex-1 px-6 py-8 lg:px-10">
          {isEmpty ? (
            <EmptyState onAdd={() => setModalOpen(true)} />
          ) : (
            <ul className="grid w-full gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {ideas.map((idea) => (
                <li key={idea.id}>
                  <IdeaCard idea={idea} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <CreateIdeaModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex min-h-[calc(100vh-14rem)] w-full items-center justify-center">
      <Card
        className={cn(
          "w-full max-w-2xl border-dashed border-indigo-200/80 bg-white/90 py-16 px-8 text-center gemini-card-glow",
          "backdrop-blur-sm"
        )}
      >
        <CardHeader className="items-center gap-4">
          <span className="flex size-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-100 via-purple-50 to-rose-50">
            <Lightbulb className="size-10 text-indigo-600" />
          </span>
          <CardTitle className="text-2xl font-semibold">No ideas yet</CardTitle>
          <CardDescription className="max-w-md text-base leading-relaxed">
            Submit your first startup concept and get AI validation — problem
            statement, risks, competitors, and more.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <Button
            type="button"
            size="lg"
            className="h-12 rounded-xl px-8 text-base gemini-btn-gradient"
            onClick={onAdd}
          >
            <Sparkles className="size-5" />
            Add your first idea
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function IdeaCard({ idea }: { idea: IdeaListItem }) {
  const preview =
    idea.description.length > 140
      ? `${idea.description.slice(0, 140)}…`
      : idea.description;

  const date = new Date(idea.updatedAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link href={`/ideas/${idea.id}`} className="block h-full">
      <Card
        className={cn(
          "h-full min-h-[220px] border-white/80 bg-white/90 transition-all hover:-translate-y-0.5 hover:border-indigo-200/60 gemini-card-glow",
          "backdrop-blur-sm"
        )}
      >
        <CardHeader className="gap-3 pb-3">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="line-clamp-2 text-lg leading-snug">
              {idea.title}
            </CardTitle>
            {idea.latestScore != null ? (
              <Badge
                variant="secondary"
                className="shrink-0 gap-1 bg-indigo-50 px-2.5 py-1 text-indigo-700"
              >
                <TrendingUp className="size-3.5" />
                {idea.latestScore}
              </Badge>
            ) : null}
          </div>
          {idea.industry ? (
            <Badge variant="outline" className="w-fit">
              {idea.industry}
            </Badge>
          ) : null}
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="line-clamp-4 flex-1 text-sm leading-relaxed text-muted-foreground">
            {preview}
          </p>
          {idea.targetAudience.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {idea.targetAudience.slice(0, 3).map((audience) => (
                <Badge
                  key={audience}
                  variant="secondary"
                  className="font-normal"
                >
                  {audience}
                </Badge>
              ))}
              {idea.targetAudience.length > 3 ? (
                <Badge variant="ghost">+{idea.targetAudience.length - 3}</Badge>
              ) : null}
            </div>
          ) : null}
          <div className="flex items-center justify-between border-t border-indigo-50 pt-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="size-4" />
              {date}
            </span>
            <span className="flex items-center gap-1 font-medium text-indigo-600">
              View details
              <ArrowRight className="size-4" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
