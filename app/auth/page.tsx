import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { AuthForm } from "@/app/auth/auth-form";
import { authOptions } from "@/lib/auth";

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
