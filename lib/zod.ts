import { z } from "zod";

const emailSchema = z
.email({ message: "Please enter a valid email address" })
.min(1, { message: "Email is required" }).trim();

const passwordSchema = z
  .string({ message: "Password is required" })
  .min(8, "Password must be at least 8 characters")
  .refine((val) => /[A-Za-z]/.test(val), {
    message: "Password must contain at least one letter",
  })
  .refine((val) => /\d/.test(val), {
    message: "Password must contain at least one number",
  })
  .refine((val) => /[^A-Za-z0-9]/.test(val), {
    message: "Password must contain at least one special character",
  });

export const authSchemas = {
  signin: z.object({
    email: emailSchema,
    password: passwordSchema,
  }),

  signup: z.object({
    name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
    email: emailSchema,
    password: passwordSchema,
  }),
};

export function parseTargetAudienceInput(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

const ideaTitleSchema = z
  .string()
  .trim()
  .min(1, "Title is required")
  .max(200, "Title is too long");

const ideaDescriptionSchema = z
  .string()
  .trim()
  .min(1, "Description is required");

const ideaIndustrySchema = z
  .string()
  .trim()
  .max(100, "Industry is too long")
  .optional();

const primaryTargetMarketSchema = z
  .string()
  .trim()
  .max(100, "Target market is too long")
  .optional();

const targetAudienceSchema = z.preprocess(
  parseTargetAudienceInput,
  z
    .array(z.string().min(1, "Audience cannot be empty"))
    .min(1, "Add at least one audience (comma-separated)")
    .max(10, "Maximum 10 target audiences allowed")
);

const targetAudienceInputSchema = z
  .string()
  .trim()
  .min(1, "Add at least one audience (comma-separated)")
  .refine(
    (value) => parseTargetAudienceInput(value).length <= 10,
    "Maximum 10 target audiences allowed"
  );

const ideaFormSchema = z.object({
  title: ideaTitleSchema,
  description: ideaDescriptionSchema,
  industry: ideaIndustrySchema,
  targetAudience: targetAudienceSchema,
  primaryTargetMarket: primaryTargetMarketSchema,
});

const createIdeaClientSchema = z.object({
  title: ideaTitleSchema,
  description: ideaDescriptionSchema,
  industry: ideaIndustrySchema,
  targetAudience: targetAudienceInputSchema,
  primaryTargetMarket: primaryTargetMarketSchema,
});



export const ideaSchemas = {
  create: ideaFormSchema,
  createClient: createIdeaClientSchema,
  update: ideaFormSchema,
  delete: z.object({
    id: z.string().trim().min(1, "Idea ID is required"),
  }),
};

export function toCreateIdeaInput(
  values: CreateIdeaFormValues
): CreateIdeaInput {
  return {
    title: values.title,
    description: values.description,
    industry: values.industry || undefined,
    targetAudience: parseTargetAudienceInput(values.targetAudience),
    primaryTargetMarket: values.primaryTargetMarket?.trim() || undefined,
  };
}

export function toCreateIdeaFormValues(
  idea: CreateIdeaInput
): CreateIdeaFormValues {
  return {
    title: idea.title,
    description: idea.description,
    industry: idea.industry ?? "",
    targetAudience: idea.targetAudience.join(", "),
    primaryTargetMarket: idea.primaryTargetMarket ?? "",
  };
}

export {
  analysisResultSchema,
  analysisSchemas,
  type AnalysisResult,
  type MvpPriority,
  type RiskSeverity,
} from "@/lib/analysis/schema";

export type SignInInput = z.infer<typeof authSchemas.signin>;
export type SignUpInput = z.infer<typeof authSchemas.signup>;
export type CreateIdeaInput = z.infer<typeof ideaSchemas.create>;
export type CreateIdeaFormValues = z.infer<typeof ideaSchemas.createClient>;
export type UpdateIdeaInput = z.infer<typeof ideaSchemas.update>;
export type DeleteIdeaInput = z.infer<typeof ideaSchemas.delete>;

/** Flat field errors for API responses and forms */
export function formatZodFieldErrors(
  error: z.ZodError
): Record<string, string[]> {
  return error.flatten().fieldErrors as Record<string, string[]>;
}