import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  Lightbulb,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";

import { ValidationPreview } from "@/components/landing/validation-preview";

const highlights = [
  {
    icon: Zap,
    text: "Gemini-powered analysis in under a minute",
  },
  {
    icon: Shield,
    text: "Competitor research with live web grounding",
  },
  {
    icon: BarChart3,
    text: "Validation scores, risks, and MVP roadmap",
  },
];

export function AuthBrandPanel() {
  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden p-8 lg:p-12">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-600/90 via-purple-600/85 to-rose-500/80"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden
      />

      <div className="relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Back to home
        </Link>

        <div className="mt-10 flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur-sm">
            <Sparkles className="size-5 text-white" />
          </span>
          <div>
            <p className="text-lg font-semibold text-white">LaunchLens</p>
            <p className="text-sm text-white/70">Founder validation workspace</p>
          </div>
        </div>

        <h1 className="mt-10 max-w-md text-3xl font-bold leading-tight tracking-tight text-white lg:text-4xl">
          Turn rough ideas into{" "}
          <span className="text-white/90">clear go / no-go decisions</span>
        </h1>
        <p className="mt-4 max-w-sm text-base leading-relaxed text-white/75">
          Sign in to capture concepts, run AI validation, and track scores across
          your startup portfolio.
        </p>

        <ul className="mt-8 space-y-4">
          {highlights.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-sm text-white/90">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/20">
                <Icon className="size-4" />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </div>

      <p className="relative z-10 mt-8 flex items-center gap-2 text-xs text-white/50">
        <Lightbulb className="size-3.5" />
        Built for solo founders and early-stage teams
      </p>
    </div>
  );
}
