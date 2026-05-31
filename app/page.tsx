import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Lightbulb,
  Search,
  Shield,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

import { ValidationPreview } from "@/components/landing/validation-preview";
import { FloatingNavbar } from "@/components/layout/floating-navbar";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: {
    absolute: siteConfig.title,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  alternates: {
    canonical: "/",
  },
};

const steps = [
  {
    step: "01",
    icon: Lightbulb,
    title: "Capture your idea",
    desc: "Title, problem, industry, audience, and target market — everything the AI needs.",
  },
  {
    step: "02",
    icon: Search,
    title: "AI researches & validates",
    desc: "Gemini searches competitors and market context, then scores risks and opportunities.",
  },
  {
    step: "03",
    icon: Target,
    title: "Ship with clarity",
    desc: "Get a validation score, MVP feature list, and a dashboard to compare ideas.",
  },
];

const features = [
  {
    icon: Zap,
    title: "Live web grounding",
    desc: "Real competitor names and market signals — not generic AI guesses.",
    accent: "from-violet-500/10 to-indigo-500/5",
  },
  {
    icon: BarChart3,
    title: "Validation score",
    desc: "0–100 score with problem statement, market potential, and tier breakdown.",
    accent: "from-emerald-500/10 to-teal-500/5",
  },
  {
    icon: Shield,
    title: "Risk & MVP map",
    desc: "Prioritized risks, opportunities, competitor matrix, and must-have MVP features.",
    accent: "from-amber-500/10 to-orange-500/5",
  },
];

export default function LandingPage() {
  return (
    <div className="gemini-mesh flex min-h-screen flex-col">
      <FloatingNavbar variant="landing" />

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-8 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:pt-16">
          <div className="text-center lg:text-left">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-white/80 px-4 py-1.5 text-sm font-medium text-indigo-700 shadow-sm backdrop-blur-sm">
              <Sparkles className="size-4" />
              AI-powered startup validation
            </p>
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.25rem]">
              Validate your startup idea{" "}
              <span className="gemini-gradient-text">before you build</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground lg:mx-0">
              {siteConfig.description}
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <Button
                size="lg"
                className="h-12 w-full rounded-xl px-8 text-base sm:w-auto gemini-btn-gradient"
                asChild
              >
                <Link href="/auth">
                  Get started free
                  <ArrowRight className="size-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 w-full rounded-xl border-indigo-200/80 bg-white/60 px-8 backdrop-blur-sm sm:w-auto"
                asChild
              >
                <Link href="#how-it-works">See how it works</Link>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground lg:justify-start">
              {["No credit card", "Gemini 2.5 Flash", "Founder-owned data"].map(
                (item) => (
                  <span key={item} className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="size-4 text-emerald-600" />
                    {item}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="lg:pt-4">
            <ValidationPreview />
          </div>
        </section>

        {/* Stats strip */}
        <section className="border-y border-indigo-100/60 bg-white/40 backdrop-blur-sm">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-10 sm:grid-cols-4 lg:px-10">
            {[
              { value: "6+", label: "Analysis dimensions" },
              { value: "Web", label: "Live competitor search" },
              { value: "0–100", label: "Validation score" },
              { value: "SSE", label: "Streaming progress" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center sm:text-left">
                <p className="text-2xl font-bold gemini-gradient-text">{value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="mx-auto max-w-7xl px-6 py-24 lg:px-10"
        >
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              From napkin sketch to validation report
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Three steps. One clear answer on whether to pursue the idea.
            </p>
          </div>
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {steps.map(({ step, icon: Icon, title, desc }, index) => (
              <div key={step} className="relative">
                {index < steps.length - 1 ? (
                  <div
                    className="absolute left-1/2 top-12 hidden h-px w-full bg-gradient-to-r from-indigo-200 to-transparent lg:block"
                    aria-hidden
                  />
                ) : null}
                <div className="relative rounded-2xl border border-white/80 bg-white/80 p-8 text-center gemini-card-glow backdrop-blur-sm lg:text-left">
                  <span className="text-xs font-bold tracking-widest text-indigo-400">
                    STEP {step}
                  </span>
                  <span className="mx-auto mt-4 flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 via-purple-50 to-rose-50 lg:mx-0">
                    <Icon className="size-6 text-indigo-600" />
                  </span>
                  <h3 className="mt-4 text-xl font-semibold">{title}</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="mx-auto max-w-7xl px-6 pb-24 lg:px-10"
        >
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Features
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything founders need to de-risk an idea
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {features.map(({ icon: Icon, title, desc, accent }) => (
              <div
                key={title}
                className={cn(
                  "group rounded-2xl border border-white/80 bg-gradient-to-br p-8 transition-all duration-300",
                  "hover:-translate-y-1 hover:shadow-[0_16px_48px_oklch(0.5_0.12_280_/_0.12)]",
                  accent,
                  "gemini-card-glow backdrop-blur-sm"
                )}
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-white/80 ring-1 ring-indigo-100 transition-transform group-hover:scale-105">
                  <Icon className="size-5 text-indigo-600" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
          <div className="relative overflow-hidden rounded-3xl border border-indigo-200/60 bg-gradient-to-br from-indigo-600 via-purple-600 to-rose-500 px-8 py-16 text-center sm:px-16">
            <div
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 30% 50%, white 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
              aria-hidden
            />
            <div className="relative">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Ready to stress-test your next idea?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-lg text-white/80">
                Create a free account and run your first AI validation in minutes.
              </p>
              <Button
                size="lg"
                className="mt-8 h-12 rounded-xl bg-white px-8 text-base text-indigo-700 hover:bg-white/90"
                asChild
              >
                <Link href="/auth">
                  Start validating
                  <ArrowRight className="size-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-indigo-100/60 bg-white/40 px-6 py-8 text-center text-sm text-muted-foreground backdrop-blur-sm">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}. Built for founders who
          validate before they build.
        </p>
      </footer>
    </div>
  );
}
