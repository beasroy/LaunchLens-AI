"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Calendar,
  Cloud,
  GraduationCap,
  Globe,
  HeartPulse,
  Lightbulb,
  Pencil,
  Plus,
  Rocket,
  Sparkles,
  Trash2,
  TrendingUp,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { deleteIdea } from "@/app/(core)/ideas/actions";
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

export type IdeaListItem = {
  id: string;
  title: string;
  description: string;
  industry: string | null;
  targetAudience: string[];
  primaryTargetMarket: string | null;
  createdAt: string;
  updatedAt: string;
  latestScore: number | null;
};

type IdeasViewProps = {
  ideas: IdeaListItem[];
};

const INDUSTRY_ICONS: { match: RegExp; icon: LucideIcon }[] = [
  { match: /health|med|care|bio|pharma/i, icon: HeartPulse },
  { match: /edu|learn|school|tutor/i, icon: GraduationCap },
  { match: /fin|bank|pay|crypto/i, icon: Wallet },
  { match: /saas|cloud|software|tech/i, icon: Cloud },
];

function getIndustryIcon(industry: string | null): LucideIcon {
  if (!industry) return Lightbulb;
  return (
    INDUSTRY_ICONS.find(({ match }) => match.test(industry))?.icon ?? Rocket
  );
}

export function IdeasView({ ideas }: IdeasViewProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<IdeaListItem | null>(null);
  const isEmpty = ideas.length === 0;

  function openCreateModal() {
    setEditingIdea(null);
    setModalOpen(true);
  }

  function openEditModal(idea: IdeaListItem) {
    setEditingIdea(idea);
    setModalOpen(true);
  }

  function handleModalOpenChange(open: boolean) {
    setModalOpen(open);
    if (!open) {
      setEditingIdea(null);
    }
  }

  return (
    <>
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="border-b border-indigo-100/60 bg-white/50 px-6 py-8 backdrop-blur-sm lg:px-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/80 px-3 py-1 text-xs font-medium text-indigo-700">
                  <Lightbulb className="size-3.5" />
                  Idea workspace
                </span>
                {!isEmpty ? (
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Sparkles className="size-3.5 text-purple-500" />
                    {ideas.length} {ideas.length === 1 ? "concept" : "concepts"}
                  </span>
                ) : null}
              </div>
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
                onClick={openCreateModal}
              >
                <Plus className="size-5" />
                New idea
              </Button>
            ) : null}
          </div>
        </header>

        <div className="flex-1 px-6 py-8 lg:px-10">
          {isEmpty ? (
            <EmptyState onAdd={openCreateModal} />
          ) : (
            <ul className="grid w-full gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {ideas.map((idea) => (
                <li key={idea.id}>
                  <IdeaCard idea={idea} onEdit={openEditModal} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <IdeaModal
        open={modalOpen}
        onOpenChange={handleModalOpenChange}
        idea={editingIdea}
      />
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
        <CardHeader className="flex flex-col items-center justify-center gap-4">
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

function IdeaCard({
  idea,
  onEdit,
}: {
  idea: IdeaListItem;
  onEdit: (idea: IdeaListItem) => void;
}) {
  const [isDeleting, startDeleteTransition] = useTransition();

  const preview =
    idea.description.length > 120
      ? `${idea.description.slice(0, 120)}…`
      : idea.description;

  const date = new Date(idea.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const IndustryIcon = getIndustryIcon(idea.industry);
  const scoreTone =
    idea.latestScore != null ? getScoreTone(idea.latestScore) : null;

  function handleDelete(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    const confirmed = window.confirm(
      `Delete "${idea.title}"? This cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    startDeleteTransition(async () => {
      try {
        await deleteIdea(idea.id);
      } catch {
        window.alert("Could not delete this idea. Please try again.");
      }
    });
  }

  function handleEdit(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    onEdit(idea);
  }

  return (
    <Card
      className={cn(
        "group relative h-full min-h-[280px] overflow-hidden border-white/80 bg-white/90 transition-all duration-300",
        "hover:-translate-y-1 hover:border-indigo-200/70 hover:shadow-[0_12px_40px_oklch(0.5_0.12_280_/_0.14)]",
        "gemini-card-glow backdrop-blur-sm"
      )}
    >
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-1 bg-gradient-to-r",
          scoreTone?.bar ?? "from-indigo-500 via-purple-500 to-rose-400"
        )}
      />

      <div className="pointer-events-none absolute -right-6 -top-6 size-28 rounded-full bg-gradient-to-br from-indigo-100/40 via-purple-100/30 to-transparent opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

      <CardHeader className="gap-4 pb-2">
        <div className="flex items-start gap-3.5">
          <span
            className={cn(
              "flex size-12 shrink-0 items-center justify-center rounded-2xl",
              "bg-gradient-to-br from-indigo-100 via-purple-50 to-rose-50",
              "ring-1 ring-indigo-100/80 transition-transform duration-300 group-hover:scale-105"
            )}
          >
            <IndustryIcon className="size-6 text-indigo-600" />
          </span>

          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <Link href={`/ideas/${idea.id}`}>
                <CardTitle className="line-clamp-2 text-lg leading-snug transition-colors hover:text-indigo-950">
                  {idea.title}
                </CardTitle>
              </Link>
              <div className="flex shrink-0 items-center gap-1">
                {idea.latestScore != null && scoreTone ? (
                  <Badge
                    variant="secondary"
                    className={cn(
                      "gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold ring-1",
                      scoreTone.badge
                    )}
                  >
                    <TrendingUp className="size-3.5" />
                    {idea.latestScore}
                  </Badge>
                ) : null}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="size-8 rounded-lg text-muted-foreground hover:bg-indigo-50 hover:text-indigo-700"
                  aria-label={`Edit ${idea.title}`}
                  onClick={handleEdit}
                >
                  <Pencil className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="size-8 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  aria-label={`Delete ${idea.title}`}
                  disabled={isDeleting}
                  onClick={handleDelete}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {idea.industry ? (
                <Badge
                  variant="outline"
                  className="w-fit gap-1.5 rounded-lg border-indigo-100 bg-white/80 px-2.5 py-0.5 font-normal text-indigo-700"
                >
                  <Building2 className="size-3" />
                  {idea.industry}
                </Badge>
              ) : null}
              {idea.primaryTargetMarket ? (
                <Badge
                  variant="outline"
                  className="w-fit gap-1.5 rounded-lg border-purple-100 bg-purple-50/50 px-2.5 py-0.5 font-normal text-purple-700"
                >
                  <Globe className="size-3" />
                  {idea.primaryTargetMarket}
                </Badge>
              ) : null}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 pt-0">
        <Link href={`/ideas/${idea.id}`} className="block flex-1">
          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {preview}
          </p>
        </Link>

        {idea.targetAudience.length > 0 ? (
          <div className="space-y-2">
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-indigo-500/80">
              <Users className="size-3.5" />
              Target audience
            </p>
            <div className="flex flex-wrap gap-1.5">
              {idea.targetAudience.slice(0, 3).map((audience) => (
                <Badge
                  key={audience}
                  variant="secondary"
                  className="rounded-lg bg-indigo-50/80 px-2.5 py-0.5 font-normal text-indigo-800/80"
                >
                  {audience}
                </Badge>
              ))}
              {idea.targetAudience.length > 3 ? (
                <Badge
                  variant="ghost"
                  className="rounded-lg px-2 text-indigo-600"
                >
                  +{idea.targetAudience.length - 3} more
                </Badge>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="mt-auto flex items-center justify-between rounded-xl border border-indigo-50/80 bg-gradient-to-r from-indigo-50/40 via-white to-purple-50/30 px-3 py-2.5 text-sm">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="size-3.5 text-indigo-400" />
            {date}
          </span>
          <Link
            href={`/ideas/${idea.id}`}
            className="flex items-center gap-1 font-medium text-indigo-600 transition-all hover:gap-2"
          >
            View details
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
