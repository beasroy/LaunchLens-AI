"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios, { isAxiosError } from "axios";
import { signIn } from "next-auth/react";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeOffIcon, EyeIcon, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
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
      const signupResponse = await axios.post("/api/auth/signup", values);
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
    }
  }

  function switchMode(next: Mode) {
    setMode(next);
    setServerError(null);
    signInForm.clearErrors();
    signUpForm.clearErrors();
  }

  return (
    <div className="rounded-2xl border border-white/80 bg-white/90 p-6 shadow-xl shadow-indigo-500/5 backdrop-blur-xl gemini-card-glow sm:p-8">
      <div className="grid grid-cols-2 gap-1 rounded-xl bg-indigo-50/80 p-1 ring-1 ring-indigo-100/80">
        {(["signin", "signup"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => switchMode(tab)}
            className={cn(
              "rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
              mode === tab
                ? "bg-white text-indigo-700 shadow-sm ring-1 ring-indigo-100/80"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab === "signin" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>

      <div className="mt-6">
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
                className="h-11 rounded-xl border-indigo-100 bg-white/80"
                aria-invalid={!!signInForm.formState.errors.email}
                {...signInForm.register("email")}
              />
            </Field>
            <Field
              id="signin-password"
              label="Password"
              error={signInForm.formState.errors.password?.message}
            >
              <PasswordInput
                id="signin-password"
                seePassword={seePassword}
                onToggle={() => setSeePassword(!seePassword)}
                autoComplete="current-password"
                error={!!signInForm.formState.errors.password}
                registerProps={signInForm.register("password")}
              />
            </Field>
            {serverError ? <FormError message={serverError} /> : null}
            <Button
              type="submit"
              className="h-11 w-full rounded-xl gemini-btn-gradient"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
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
                className="h-11 rounded-xl border-indigo-100 bg-white/80"
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
                className="h-11 rounded-xl border-indigo-100 bg-white/80"
                aria-invalid={!!signUpForm.formState.errors.email}
                {...signUpForm.register("email")}
              />
            </Field>
            <Field
              id="signup-password"
              label="Password"
              error={signUpForm.formState.errors.password?.message}
              hint="At least 8 characters with a letter, number, and symbol"
            >
              <PasswordInput
                id="signup-password"
                seePassword={seePassword}
                onToggle={() => setSeePassword(!seePassword)}
                autoComplete="new-password"
                error={!!signUpForm.formState.errors.password}
                registerProps={signUpForm.register("password")}
              />
            </Field>
            {serverError ? <FormError message={serverError} /> : null}
            <Button
              type="submit"
              className="h-11 w-full rounded-xl gemini-btn-gradient"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Creating account…
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

function PasswordInput({
  id,
  seePassword,
  onToggle,
  autoComplete,
  error,
  registerProps,
}: {
  id: string;
  seePassword: boolean;
  onToggle: () => void;
  autoComplete: string;
  error: boolean;
  registerProps: UseFormRegisterReturn<"password">;
}) {
  return (
    <div className="relative">
      <Input
        id={id}
        type={seePassword ? "text" : "password"}
        autoComplete={autoComplete}
        aria-invalid={error}
        className="h-11 rounded-xl border-indigo-100 bg-white/80 pr-10"
        {...registerProps}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="absolute right-1 top-1/2 -translate-y-1/2 rounded-lg text-muted-foreground"
        aria-label={seePassword ? "Hide password" : "Show password"}
        onClick={onToggle}
      >
        {seePassword ? (
          <EyeOffIcon className="size-4" />
        ) : (
          <EyeIcon className="size-4" />
        )}
      </Button>
    </div>
  );
}

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-foreground">
        {label}
      </Label>
      {children}
      {hint && !error ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

function FormError({ message }: { message: string }) {
  return (
    <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
      {message}
    </p>
  );
}
