"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios, { isAxiosError } from "axios";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeOffIcon, EyeIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authSchemas, type SignInInput, type SignUpInput } from "@/lib/zod";
import { cn } from "@/lib/utils";

type Mode = "signin" | "signup";

export function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [seePassword, setSeePassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const signInForm = useForm<SignInInput>({
    resolver: zodResolver(authSchemas.signin),
    defaultValues: { email: "", password: "" },
  });

  const signUpForm = useForm<SignUpInput>({
    resolver: zodResolver(authSchemas.signup),
    defaultValues: { name: "", email: "", password: "" },
  });

  const activeForm = mode === "signin" ? signInForm : signUpForm;
  const isSubmitting = activeForm.formState.isSubmitting;

  async function onSignIn(values: SignInInput) {
    setServerError(null);

    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (result?.error) {
      setServerError("Invalid email or password");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  async function onSignUp(values: SignUpInput) {
    setServerError(null);

    try {
      const  signupResponse = await axios.post("/api/auth/signup", values);
      if (signupResponse.status === 201) {
        setMode("signin");
        signInForm.setValue("email", values.email);
        return;
      }
    } catch (error) {
      const message = isAxiosError<{ error?: string }>(error)
        ? (error.response?.data?.error ?? "Could not create account")
        : "Could not create account";
      setServerError(message);
      return;
    }
  }

  function switchMode(next: Mode) {
    setMode(next);
    setServerError(null);
    signInForm.clearErrors();
    signUpForm.clearErrors();
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{mode === "signin" ? "Sign in" : "Create account"}</CardTitle>
        <CardDescription>
          {mode === "signin"
            ? "Use your email and password to continue."
            : "Register with email and password."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
          {(["signin", "signup"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => switchMode(tab)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                mode === tab
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab === "signin" ? "Sign in" : "Sign up"}
            </button>
          ))}
        </div>

        {mode === "signin" ? (
          <form
            onSubmit={signInForm.handleSubmit(onSignIn)}
            className="space-y-4"
            noValidate
          >
            <Field
              id="signin-email"
              label="Email"
              error={signInForm.formState.errors.email?.message}
            >
              <Input
                id="signin-email"
                type="email"
                autoComplete="email"
                aria-invalid={!!signInForm.formState.errors.email}
                {...signInForm.register("email")}
              />
            </Field>
            <Field
              id="signin-password"
              label="Password"
              error={signInForm.formState.errors.password?.message}
            >
              <div className="relative">
                <Input
                  id="signin-password"
                  type={seePassword ? "text" : "password"}
                  autoComplete="current-password"
                  aria-invalid={!!signInForm.formState.errors.password}
                  className="pr-9"
                  {...signInForm.register("password")}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={seePassword ? "Hide password" : "Show password"}
                    onClick={() => setSeePassword(!seePassword)}
                  >
                    {seePassword ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </Field>
            {serverError ? <FormError message={serverError} /> : null}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        ) : (
          <form
            onSubmit={signUpForm.handleSubmit(onSignUp)}
            className="space-y-4"
            noValidate
          >
            <Field
              id="signup-name"
              label="Name"
              error={signUpForm.formState.errors.name?.message}
            >
              <Input
                id="signup-name"
                type="text"
                autoComplete="name"
                aria-invalid={!!signUpForm.formState.errors.name}
                {...signUpForm.register("name")}
              />
            </Field>
            <Field
              id="signup-email"
              label="Email"
              error={signUpForm.formState.errors.email?.message}
            >
              <Input
                id="signup-email"
                type="email"
                autoComplete="email"
                aria-invalid={!!signUpForm.formState.errors.email}
                {...signUpForm.register("email")}
              />
            </Field>
            <Field
              id="signup-password"
              label="Password"
              error={signUpForm.formState.errors.password?.message}
            >
              <div className="relative">
                <Input
                  id="signup-password"
                  type={seePassword ? "text" : "password"}
                  autoComplete="new-password"
                  aria-invalid={!!signUpForm.formState.errors.password}
                  className="pr-9"
                  {...signUpForm.register("password")}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={seePassword ? "Hide password" : "Show password"}
                    onClick={() => setSeePassword(!seePassword)}
                  >
                    {seePassword ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </Field>
        
            {serverError ? <FormError message={serverError} /> : null}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating account…" : "Create account"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

function Field({
  id,
  label,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}

function FormError({ message }: { message: string }) {
  return (
    <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
      {message}
    </p>
  );
}
