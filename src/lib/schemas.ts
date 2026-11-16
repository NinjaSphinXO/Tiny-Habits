import { z } from "zod";

// "required" first, then the format. With Zod 4, `z.email().min(1)` reports the
// format error FIRST for an empty string, so "Email is required" would never show.
// A plain string + regex keeps the inferred type a simple `string` (a
// `.pipe(z.email())` version made `email` optional in some setups).
const emailField = z
  .string()
  .trim()
  .min(1, { message: "Email is required" })
  .regex(z.regexes.email, { message: "Enter a valid email" });

const passwordField = z
  .string()
  .min(6, { message: "Password must be at least 6 characters" });

export const loginSchema = z.object({
  email: emailField,
  password: passwordField,
});

export const signupSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(2, { message: "Username must be at least 2 characters" })
      .max(30, { message: "Username can't exceed 30 characters" })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: "Username can only contain letters, numbers, and underscores",
      }),
    email: emailField,
    password: passwordField,
    // only "required" here: the match check lives in .refine below
    confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type SignupValues = z.infer<typeof signupSchema>;

export const habitSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Title is required" })
    .max(40, { message: "Max 40 characters" }),
});

export type HabitValues = z.infer<typeof habitSchema>;