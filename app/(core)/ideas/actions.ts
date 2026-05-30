"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CreateIdeaInput, ideaSchemas } from "@/lib/zod";

function parseTargetAudience(value: FormDataEntryValue | null): string[] {
  if (!value || typeof value !== "string") {
    return [];
  }
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function createIdea(values: CreateIdeaInput) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth");
  }

  const parsed = ideaSchemas.create.safeParse({
    title: values.title,
    description: values.description,
    industry: values.industry || undefined,
    targetAudience: values.targetAudience,
  });

  if (!parsed.success) {
    throw new Error("Validation failed");
  }

  const { title, description, industry, targetAudience } = parsed.data;

  const idea = await prisma.idea.create({
    data: {
      title,
      description,
      industry: industry ?? null,
      targetAudience,
      userId: session.user.id,
    },
  });

  revalidatePath("/ideas");
  redirect(`/ideas/${idea.id}`);
}

export async function deleteIdea(ideaId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth");
  }

  const parsed = ideaSchemas.delete.safeParse({ id: ideaId });
  if (!parsed.success) {
    throw new Error("Validation failed");
  }

  const { id } = parsed.data;

  await prisma.idea.delete({ where: { id, userId: session.user.id } });
  revalidatePath("/ideas");
  redirect("/ideas");
}

export async function updateIdea(ideaId: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth");
  }

  const parsed = ideaSchemas.update.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    industry: formData.get("industry") || undefined,
    targetAudience: parseTargetAudience(formData.get("targetAudience")),
  });

  if (!parsed.success) {
    throw new Error("Validation failed");
  }

  const { title, description, industry, targetAudience } = parsed.data;

  await prisma.idea.update({
    where: { id: ideaId, userId: session.user.id },
    data: { title, description, industry: industry ?? null, targetAudience },
  });

  revalidatePath("/ideas");
  redirect(`/ideas/${ideaId}`);
}