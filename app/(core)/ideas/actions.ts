"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  CreateIdeaInput,
  ideaSchemas,
} from "@/lib/zod";

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
    primaryTargetMarket: values.primaryTargetMarket || undefined,
  });

  if (!parsed.success) {
    throw new Error("Validation failed");
  }

  const { title, description, industry, targetAudience, primaryTargetMarket } =
    parsed.data;

  const idea = await prisma.idea.create({
    data: {
      title,
      description,
      industry: industry ?? null,
      targetAudience,
      primaryTargetMarket: primaryTargetMarket ?? null,
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

export async function updateIdea(ideaId: string, values: CreateIdeaInput) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth");
  }

  const parsed = ideaSchemas.update.safeParse({
    title: values.title,
    description: values.description,
    industry: values.industry || undefined,
    targetAudience: values.targetAudience,
    primaryTargetMarket: values.primaryTargetMarket || undefined,
  });

  if (!parsed.success) {
    throw new Error("Validation failed");
  }

  const { title, description, industry, targetAudience, primaryTargetMarket } =
    parsed.data;

  await prisma.idea.update({
    where: { id: ideaId, userId: session.user.id },
    data: {
      title,
      description,
      industry: industry ?? null,
      targetAudience,
      primaryTargetMarket: primaryTargetMarket ?? null,
    },
  });

  revalidatePath("/ideas");
  revalidatePath(`/ideas/${ideaId}`);
}