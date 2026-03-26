import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, Navigate, useSearchParams } from "react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { paths } from "@/config/paths";
import { cn } from "@/lib/utils";
import { parseApiError } from "@/utils/error";

import type { ResetPasswordFormValues } from "../schemas";

import { useResetPasswordMutation } from "../api";
import { resetPasswordSchema } from "../schemas";

type ResetPasswordFormProps = {
  className?: string;
  [key: string]: unknown;
};

export function ResetPasswordForm({ className, ...props }: ResetPasswordFormProps) {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [resetPassword, { isLoading: isSubmitting }] = useResetPasswordMutation();
  const [isResetComplete, setIsResetComplete] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  // ── Missing params — redirect to forgot password ────────────────────────
  if (!email || !token) {
    return <Navigate to={paths.auth.forgotPassword.path} replace />;
  }

  const onSubmit = async (values: ResetPasswordFormValues) => {
    try {
      const { message } = await resetPassword({
        email,
        token,
        newPassword: values.newPassword,
      }).unwrap();

      toast.success(message);

      setIsResetComplete(true);
    }
    catch (err) {
      const { message, fieldErrors } = parseApiError<ResetPasswordFormValues>(err);

      (Object.entries(fieldErrors) as [keyof ResetPasswordFormValues, string][]).forEach(
        ([field, msg]) => {
          if (msg) {
            setError(field, { type: "server", message: msg });
          }
        },
      );

      if (Object.keys(fieldErrors).length === 0) {
        toast.error(message);
      }
    }
  };

  // ── Success State ───────────────────────────────────────────────────────
  if (isResetComplete) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Password reset</CardTitle>
            <CardDescription>
              Your password has been reset successfully. You can now sign in
              with your new password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <Link to={paths.auth.signin.path}>Sign in</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Form State ──────────────────────────────────────────────────────────
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset your password</CardTitle>
          <CardDescription>
            Enter a new password for
            {" "}
            <span className="font-medium text-foreground">{email}</span>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              {/* New Password */}
              <Controller
                name="newPassword"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>New password</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id={field.name}
                        type={showPassword ? "text" : "password"}
                        aria-invalid={fieldState.invalid}
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupButton
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          onClick={() => setShowPassword(prev => !prev)}
                        >
                          {showPassword
                            ? <EyeOff className="size-4" />
                            : <Eye className="size-4" />}
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Confirm Password */}
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Confirm password</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id={field.name}
                        type={showConfirmPassword ? "text" : "password"}
                        aria-invalid={fieldState.invalid}
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupButton
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                          onClick={() => setShowConfirmPassword(prev => !prev)}
                        >
                          {showConfirmPassword
                            ? <EyeOff className="size-4" />
                            : <Eye className="size-4" />}
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Submit */}
              <Field>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Resetting..." : "Reset password"}
                </Button>
              </Field>

              {/* Back to sign in */}
              <Field>
                <Button variant="outline" className="w-full" asChild>
                  <Link to={paths.auth.signin.path}>
                    <ArrowLeft className="size-4" />
                    Back to sign in
                  </Link>
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
