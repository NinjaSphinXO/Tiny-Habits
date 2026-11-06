import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .email({ message: "Enter a valid email" })
    .min(1, { message: "Email is required" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export const signupSchema = z
  .object({
    username: z
      .string()
      .min(2, { message: "Username must be at least 2 characters" })
      .max(30, { message: "Username can't exceed 30 characters" })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: "Username can only contain letters, numbers, and underscores",
      }),
    email: z
      .email({ message: "Enter a valid email" })
      .min(1, { message: "Email is required" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Confirm Password must be at least 6 characters" }),
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
