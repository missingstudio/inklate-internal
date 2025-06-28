import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
});
export type SignupType = z.infer<typeof signupSchema>;

export const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
});
export type SigninType = z.infer<typeof signinSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address")
});
export type ForgotPasswordType = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters")
});
export type ResetPasswordType = z.infer<typeof resetPasswordSchema>;
