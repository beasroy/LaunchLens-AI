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

const ideaFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title is too long"),

  description: z
    .string()
    .trim()
    .min(1, "Description is required"),

  industry: z
    .string()
    .trim()
    .max(100, "Industry is too long")
    .optional(),

  targetAudience: z
    .array(z.string().trim().min(1, "Audience cannot be empty"))
    .min(1, "Add at least one audience (comma-separated)")
    .max(10, "Maximum 10 target audiences allowed")
});



export const ideaSchemas = {
  create: ideaFormSchema,
  update: ideaFormSchema,
  delete: z.object({
    id: z.string().trim().min(1, "Idea ID is required"),
  }),
};

export type SignInInput = z.infer<typeof authSchemas.signin>;
export type SignUpInput = z.infer<typeof authSchemas.signup>;
export type CreateIdeaInput = z.infer<typeof ideaSchemas.create>;
export type UpdateIdeaInput = z.infer<typeof ideaSchemas.update>;
export type DeleteIdeaInput = z.infer<typeof ideaSchemas.delete>;

/** Flat field errors for API responses and forms */
export function formatZodFieldErrors(
  error: z.ZodError
): Record<string, string[]> {
  return error.flatten().fieldErrors as Record<string, string[]>;
}