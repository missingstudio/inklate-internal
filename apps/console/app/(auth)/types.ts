import { authClient } from "~/lib/auth-client";
import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
});
export type SignupType = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
});
export type LoginType = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address")
});
export type ForgotPasswordType = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters")
});
export type ResetPasswordType = z.infer<typeof resetPasswordSchema>;

export const organizationCreationSchema = z.object({
  name: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .refine(
      async (value) => {
        const result = await authClient.organization.checkSlug({
          slug: value
        });

        return !!result.data?.status;
      },
      { message: "Slug is already taken" }
    )
});
