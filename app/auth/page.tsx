import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Sparkles } from "lucide-react";

import { AuthForm } from "@/app/auth/auth-form";
import { AuthBrandPanel } from "@/components/landing/auth-brand-panel";
import { authOptions } from "@/lib/auth";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Sign in",
  description:
    "Sign in or create a LaunchLens account to validate your startup ideas with AI.",
  path: "/auth",
  noIndex: true,
});

export default async function AuthPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="gemini-mesh flex min-h-screen flex-col lg:grid lg:grid-cols-2 lg:flex-row">
      <div className="hidden min-h-screen lg:block">
        <AuthBrandPanel />
      </div>

      <div className="flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-6 py-5 lg:px-10">
          <Link href="/" className="flex items-center gap-2.5 lg:hidden">
            <span className="flex size-9 items-center justify-center rounded-xl gemini-btn-gradient">
              <Sparkles className="size-4 text-white" />
            </span>
            <span className="text-lg font-semibold gemini-gradient-text">
              LaunchLens
            </span>
          </Link>
          <Link
            href="/"
            className="ml-auto text-sm font-medium text-muted-foreground transition-colors hover:text-indigo-700 lg:hidden"
          >
            Back to home
          </Link>
        </header>

        <main className="flex flex-1 items-center justify-center px-6 pb-12 lg:px-10">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:text-left">
              <h1 className="text-2xl font-bold tracking-tight lg:hidden">
                Welcome back
              </h1>
              <p className="mt-2 text-muted-foreground lg:hidden">
                Sign in or create an account to start validating ideas.
              </p>
              <h1 className="hidden text-2xl font-bold tracking-tight lg:block">
                {`Welcome to LaunchLens`}
              </h1>
              <p className="mt-2 hidden text-muted-foreground lg:block">
                Sign in to your workspace or create a new account.
              </p>
            </div>
            <AuthForm />
          </div>
        </main>
      </div>
    </div>
  );
}
