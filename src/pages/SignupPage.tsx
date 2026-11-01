import { useAppSelector } from "@/hooks/redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/lib/schemas";
import type { SignupValues } from "@/lib/schemas";
import { Link, Navigate } from "react-router";
import { useForm } from "react-hook-form";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const SignupPage = () => {
  const { user, loading } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async ({ email, password }: SignupValues) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) toast.error(error.message);
  };

  if (loading) return <p role="status">Loading...</p>;
  if (user) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Sign up</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FieldGroup>
              {/* Email Field */}
              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor="signup-email">Email</FieldLabel>
                <Input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "signup-email-error" : undefined}
                  {...register("email")}
                />
                {errors.email && (
                  <FieldError id="signup-email-error">{errors.email.message}</FieldError>
                )}
              </Field>

              {/* Password Field */}
              <Field data-invalid={!!errors.password}>
                <FieldLabel htmlFor="signup-password">Password</FieldLabel>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "signup-password-error" : undefined}
                  {...register("password")}
                />
                {errors.password && (
                  <FieldError id="signup-password-error">
                    {errors.password.message}
                  </FieldError>
                )}
              </Field>

              {/* Confirm Password Field */}
              <Field data-invalid={!!errors.confirmPassword}>
                <FieldLabel htmlFor="signup-confirm-password">
                  Confirm password
                </FieldLabel>
                <Input
                  id="signup-confirm-password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={
                    errors.confirmPassword ? "signup-confirm-password-error" : undefined
                  }
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <FieldError id="signup-confirm-password-error">
                    {errors.confirmPassword.message}
                  </FieldError>
                )}
              </Field>
            </FieldGroup>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Sign up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="px-0 pt-2">
          Already have an account? <Link to="/login">Log in</Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignupPage;
