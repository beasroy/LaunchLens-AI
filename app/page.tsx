import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Lightbulb, Shield, Sparkles, Zap } from "lucide-react";

import { FloatingNavbar } from "@/components/layout/floating-navbar";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

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

export default function LandingPage() {
  return (
    <div className="gemini-mesh flex min-h-screen flex-col">
      <FloatingNavbar variant="landing" />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pb-20 pt-12 lg:px-10 lg:pt-20">
        <section className="mx-auto max-w-4xl text-center lg:text-left">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-4 py-1.5 text-sm font-medium text-indigo-700">
            <Sparkles className="size-4" />
            AI-powered startup validation
          </p>
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Validate your startup idea{" "}
            <span className="gemini-gradient-text">before you build</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl lg:mx-0 mx-auto">
            LaunchLens analyzes risks, competitors, market assumptions, and MVP
            paths — so founders move forward with clarity.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start justify-center">
            <Button size="lg" className="h-12 rounded-xl px-8 text-base gemini-btn-gradient" asChild>
              <Link href="/auth">
                Get started free
                <ArrowRight className="size-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 rounded-xl px-8" asChild>
              <Link href="/auth">Sign in</Link>
            </Button>
          </div>
        </section>

        <section
          id="features"
          className="mt-24 grid w-full gap-6 sm:grid-cols-3"
        >
          {[
            {
              icon: Lightbulb,
              title: "Submit ideas",
              desc: "Capture concepts with industry and target audience.",
            },
            {
              icon: Zap,
              title: "AI analysis",
              desc: "Get validation scores, risks, competitors, and MVP features.",
            },
            {
              icon: Shield,
              title: "Founder-owned",
              desc: "Your workspace, your data — built for solo founders.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/80 bg-white/80 p-6 gemini-card-glow backdrop-blur-sm"
            >
              <Icon className="mb-4 size-8 text-indigo-600" />
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-muted-foreground">{desc}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
