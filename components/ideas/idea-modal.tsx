"use client";

import { useEffect, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Globe, Loader2, Target, Type, Users } from "lucide-react";

import { createIdea, updateIdea } from "@/app/(core)/ideas/actions";
import type { IdeaListItem } from "@/components/ideas/ideas-view";
import { Button } from "@/components/ui/button";
import { CreatableCombobox } from "@/components/ui/creatable-combobox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PRIMARY_TARGET_MARKET_SUGGESTIONS } from "@/lib/idea-markets";
import {
  CreateIdeaFormValues,
  ideaSchemas,
  toCreateIdeaFormValues,
  toCreateIdeaInput,
} from "@/lib/zod";

const emptyFormValues: CreateIdeaFormValues = {
  title: "",
  description: "",
  industry: "",
  targetAudience: "",
  primaryTargetMarket: "",
};

type CreateIdeaModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  idea?: IdeaListItem | null;
};

export function IdeaModal({
  open,
  onOpenChange,
  idea = null,
}: CreateIdeaModalProps) {
  const isEditing = idea != null;
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<CreateIdeaFormValues>({
    resolver: zodResolver(ideaSchemas.createClient),
    defaultValues: emptyFormValues,
  });

  useEffect(() => {
    if (open) {
      form.reset(
        isEditing
          ? toCreateIdeaFormValues({
              title: idea.title,
              description: idea.description,
              industry: idea.industry ?? undefined,
              targetAudience: idea.targetAudience,
              primaryTargetMarket: idea.primaryTargetMarket ?? undefined,
            })
          : emptyFormValues
      );
      setServerError(null);
    }
  }, [open, isEditing, idea, form]);

  function onSubmit(values: CreateIdeaFormValues) {
    setServerError(null);

    startTransition(async () => {
      try {
        const payload = toCreateIdeaInput(values);

        if (isEditing) {
          await updateIdea(idea.id, payload);
          onOpenChange(false);
        } else {
          await createIdea(payload);
        }
      } catch {
        setServerError("Something went wrong. Please try again.");
      }
    });
  }

  function handleOpenChange(next: boolean) {
    if (!isPending) {
      onOpenChange(next);
      if (!next) {
        form.reset(emptyFormValues);
        setServerError(null);
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto border-white/80 bg-white/95 sm:max-w-2xl"
        onPointerDownOutside={(event) => {
          const target = event.target as HTMLElement;
          if (target.closest('[data-slot="combobox-content"]')) {
            event.preventDefault();
          }
        }}
      >
        <DialogHeader className="gap-1 pb-2">
          <DialogTitle className="text-2xl font-semibold">
            {isEditing ? "Edit startup idea" : "New startup idea"}
          </DialogTitle>
          <DialogDescription className="text-base">
            {isEditing
              ? "Update your concept details."
              : "Describe your concept, we'll help you validate it with AI."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          <FormField
            id="title"
            label="Title"
            icon={Type}
            error={form.formState.errors.title?.message}
          >
            <Input
              id="title"
              placeholder="e.g. Uber for home tutors"
              aria-invalid={!!form.formState.errors.title}
              {...form.register("title")}
            />
          </FormField>

          <FormField
            id="description"
            label="Description"
            error={form.formState.errors.description?.message}
          >
            <Textarea
              id="description"
              rows={5}
              placeholder="What problem does it solve? Who pays?"
              className="min-h-32 resize-none text-base"
              aria-invalid={!!form.formState.errors.description}
              {...form.register("description")}
            />
          </FormField>

          <FormField
            id="industry"
            label="Industry"
            icon={Building2}
            error={form.formState.errors.industry?.message}
            optional
          >
            <Input
              id="industry"
              placeholder="EdTech, Health, SaaS…"
              aria-invalid={!!form.formState.errors.industry}
              {...form.register("industry")}
            />
          </FormField>

          <FormField
            id="targetAudience"
            label="Target audience"
            icon={Users}
            error={form.formState.errors.targetAudience?.message}
            hint="Comma-separated, e.g. Students, Parents"
          >
            <Input
              id="targetAudience"
              placeholder="Students, Parents, Schools"
              aria-invalid={!!form.formState.errors.targetAudience}
              {...form.register("targetAudience")}
            />
          </FormField>

          <FormField
            id="primaryTargetMarket"
            label="Primary target market"
            icon={Globe}
            error={form.formState.errors.primaryTargetMarket?.message}
            hint="Pick a suggestion or type your own, e.g. Nordic Countries"
            optional
          >
            <Controller
              control={form.control}
              name="primaryTargetMarket"
              render={({ field }) => (
                <CreatableCombobox
                  id="primaryTargetMarket"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  suggestions={PRIMARY_TARGET_MARKET_SUGGESTIONS}
                  placeholder="Global, India, United States…"
                  aria-invalid={!!form.formState.errors.primaryTargetMarket}
                />
              )}
            />
          </FormField>

          {serverError ? (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {serverError}
            </p>
          ) : null}

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-xl"
              disabled={isPending}
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-xl gemini-btn-gradient"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {isEditing ? "Saving…" : "Creating…"}
                </>
              ) : (
                <>
                  <Target className="size-4" />
                  {isEditing ? "Save changes" : "Create idea"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function FormField({
  id,
  label,
  error,
  hint,
  icon: Icon,
  optional,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  icon?: React.ComponentType<{ className?: string }>;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-center gap-2 text-foreground">
        {Icon ? <Icon className="size-3.5 text-indigo-500" /> : null}
        {label}
        {optional ? (
          <span className="text-xs font-normal text-muted-foreground">
            (optional)
          </span>
        ) : null}
      </Label>
      {children}
      {hint && !error ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
