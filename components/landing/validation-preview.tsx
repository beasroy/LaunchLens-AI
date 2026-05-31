import {
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function ValidationPreview() {
  return (
    <div className="landing-float relative mx-auto w-full max-w-md lg:max-w-none">
      <div
        className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-indigo-400/20 via-purple-400/15 to-rose-400/20 blur-2xl"
        aria-hidden
      />
      <div className="relative overflow-hidden rounded-2xl border border-white/80 bg-white/90 p-5 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl gemini-card-glow sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg gemini-btn-gradient">
              <Sparkles className="size-4 text-white" />
            </span>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                AI validation
              </p>
              <p className="text-sm font-semibold">TutorMatch Pro</p>
            </div>
          </div>
          <Badge className="border-0 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60">
            78/100
          </Badge>
        </div>

        <div className="mb-4 h-2 overflow-hidden rounded-full bg-indigo-100">
          <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-emerald-400 to-teal-500" />
        </div>

        <div className="space-y-3">
          <PreviewRow
            icon={TrendingUp}
            label="Market potential"
            value="Strong niche in APAC edtech"
            tone="indigo"
          />
          <PreviewRow
            icon={Users}
            label="Competitors"
            value="3 direct players identified"
            tone="purple"
          />
          <PreviewRow
            icon={AlertTriangle}
            label="Top risk"
            value="Crowded parent acquisition"
            tone="amber"
          />
          <PreviewRow
            icon={CheckCircle2}
            label="MVP focus"
            value="Booking + tutor matching"
            tone="emerald"
          />
        </div>

        <div className="mt-5 flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50/50 px-3 py-2.5">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-indigo-400 opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-indigo-500" />
          </span>
          <p className="text-xs text-indigo-700">
            Searching competitors & market data…
          </p>
        </div>
      </div>

      <div
        className="absolute -bottom-6 -left-6 hidden rounded-xl border border-white/80 bg-white/90 px-4 py-3 shadow-lg backdrop-blur-sm sm:block"
        aria-hidden
      >
        <p className="text-xs text-muted-foreground">Risks found</p>
        <p className="text-lg font-bold text-foreground">4</p>
      </div>
      <div
        className="absolute -right-4 -top-4 hidden rounded-xl border border-white/80 bg-white/90 px-4 py-3 shadow-lg backdrop-blur-sm sm:block"
        aria-hidden
      >
        <p className="text-xs text-muted-foreground">MVP features</p>
        <p className="text-lg font-bold gemini-gradient-text">6</p>
      </div>
    </div>
  );
}

function PreviewRow({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone: "indigo" | "purple" | "amber" | "emerald";
}) {
  const iconTone = {
    indigo: "bg-indigo-100 text-indigo-600",
    purple: "bg-purple-100 text-purple-600",
    amber: "bg-amber-100 text-amber-600",
    emerald: "bg-emerald-100 text-emerald-600",
  }[tone];

  return (
    <div className="flex items-start gap-3 rounded-xl border border-indigo-50/80 bg-indigo-50/30 px-3 py-2.5">
      <span
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-lg",
          iconTone
        )}
      >
        <Icon className="size-3.5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
