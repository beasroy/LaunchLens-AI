import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { AuthForm } from "@/app/auth/auth-form";
import { authOptions } from "@/lib/auth";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Sign in",
  description: "Sign in or create a LaunchLens account to validate your startup ideas with AI.",
  path: "/auth",
  noIndex: true,
});

export default async function AuthPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <AuthForm />
    </main>
  );
}
