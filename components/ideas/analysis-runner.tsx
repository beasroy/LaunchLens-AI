"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Loader2, Search, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AnalysisPhase = "idle" | "searching" | "generating" | "saving" | "done" | "error";

type ActiveModel = {
  modelId: string;
  label: string;
  isFallback: boolean;
};

type AnalysisRunnerProps = {
  ideaId: string;
  hasAnalysis: boolean;
};

const PHASE_LABELS: Record<Exclude<AnalysisPhase, "idle" | "done" | "error">, string> = {
  searching: "Searching the web for market data…",
  generating: "Generating validation report…",
  saving: "Saving analysis…",
};

function parseSseBlock(block: string): { event: string; data: string } | null {
  const lines = block.split("\n");
  let event = "message";
  let data = "";

  for (const line of lines) {
    if (line.startsWith("event: ")) {
      event = line.slice(7).trim();
    } else if (line.startsWith("data: ")) {
      data = line.slice(6);
    }
  }

  if (!data) return null;
  return { event, data };
}

export function AnalysisRunner({ ideaId, hasAnalysis }: AnalysisRunnerProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<AnalysisPhase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState("");
  const [sources, setSources] = useState<{ queries: string[]; titles: string[] }>({
    queries: [],
    titles: [],
  });
  const [activeModel, setActiveModel] = useState<ActiveModel | null>(null);

  const isRunning = phase === "searching" || phase === "generating" || phase === "saving";

  const runAnalysis = useCallback(async () => {
    setPhase("searching");
    setError(null);
    setPreview("");
    setActiveModel(null);
    setSources({ queries: [], titles: [] });

    try {
      const response = await fetch(`/api/ideas/${ideaId}/analyze`, {
        method: "POST",
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(body?.error ?? "Failed to start analysis.");
      }

      if (!response.body) {
        throw new Error("No response stream received.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let completed = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const blocks = buffer.split("\n\n");
        buffer = blocks.pop() ?? "";

        for (const block of blocks) {
          const parsed = parseSseBlock(block);
          if (!parsed) continue;

          const payload = JSON.parse(parsed.data) as Record<string, unknown>;

          if (parsed.event === "status" && typeof payload.phase === "string") {
            setPhase(payload.phase as AnalysisPhase);
          } else if (
            parsed.event === "model" &&
            typeof payload.label === "string" &&
            typeof payload.modelId === "string"
          ) {
            setActiveModel({
              modelId: payload.modelId as string,
              label: payload.label as string,
              isFallback: Boolean(payload.isFallback),
            });
          } else if (parsed.event === "delta" && typeof payload.text === "string") {
            setPreview(payload.text);
          } else if (parsed.event === "sources") {
            setSources({
              queries: Array.isArray(payload.queries)
                ? (payload.queries as string[])
                : [],
              titles: Array.isArray(payload.titles)
                ? (payload.titles as string[])
                : [],
            });
          } else if (parsed.event === "complete") {
            completed = true;
            setPhase("done");
            router.refresh();
          } else if (parsed.event === "error") {
            throw new Error(
              typeof payload.message === "string"
                ? payload.message
                : "Analysis failed."
            );
          }
        }
      }

      if (!completed) {
        setPhase("idle");
      }
    } catch (err) {
      setPhase("error");
      setError(err instanceof Error ? err.message : "Analysis failed.");
    }
  }, [ideaId, router]);

  return (
    <div className="mt-10 space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          size="lg"
          className="h-11 rounded-xl px-6 gemini-btn-gradient"
          disabled={isRunning}
          onClick={runAnalysis}
        >
          {isRunning ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <Sparkles className="size-5" />
          )}
          {hasAnalysis ? "Re-run validation" : "Run validation"}
        </Button>
        {isRunning && phase in PHASE_LABELS ? (
          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin text-indigo-500" />
            {PHASE_LABELS[phase as keyof typeof PHASE_LABELS]}
          </span>
        ) : null}
        {activeModel ? (
          <span
            className={cn(
              "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
              activeModel.isFallback
                ? "border border-amber-200 bg-amber-50 text-amber-800"
                : "border border-indigo-100 bg-indigo-50 text-indigo-700"
            )}
          >
            {activeModel.isFallback ? "Fallback: " : "Model: "}
            {activeModel.label}
          </span>
        ) : null}
      </div>

      {error ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50/80 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      ) : null}

      {isRunning && sources.titles.length > 0 ? (
        <div className="rounded-2xl border border-indigo-100 bg-white/80 p-4">
          <p className="mb-2 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-indigo-600">
            <Search className="size-3.5" />
            Sources consulted
          </p>
          <div className="flex flex-wrap gap-2">
            {sources.titles.map((title) => (
              <span
                key={title}
                className="rounded-full bg-indigo-50 px-3 py-1 text-xs text-indigo-700"
              >
                {title}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {isRunning && preview ? (
        <pre
          className={cn(
            "max-h-48 overflow-auto rounded-2xl border border-indigo-100 bg-slate-950/95 p-4",
            "font-mono text-xs leading-relaxed text-emerald-300/90"
          )}
        >
          {preview}
        </pre>
      ) : null}
    </div>
  );
}
