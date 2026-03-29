import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router";
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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { paths } from "@/config/paths";
import { cn } from "@/lib/utils";
import { parseApiError } from "@/utils/error";

import type { ForgotPasswordFormValues } from "../schemas";

import { useForgotPasswordMutation } from "../api";
import { forgotPasswordSchema } from "../schemas";

type ForgotPasswordFormProps = {
  className?: string;
  [key: string]: unknown;
};

export function ForgotPasswordForm({ className, ...props }: ForgotPasswordFormProps) {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const [isEmailSent, setIsEmailSent] = useState(false);

  const {
    control,
    setError,
    getValues,
    handleSubmit,
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      const { message } = await forgotPassword(values).unwrap();

      toast.success(message);

      setIsEmailSent(true);
    }
    catch (err) {
      const { message, fieldErrors } = parseApiError<ForgotPasswordFormValues>(err);

      // Set field-level errors
      (Object.entries(fieldErrors)).forEach(
        ([field, msg]) => {
          setError(field as keyof ForgotPasswordFormValues, {
            type: "server",
            message: msg,
          });
        },
      );

      // Set general error
      if (Object.keys(fieldErrors).length === 0) {
        toast.error(message);
      }
    }
  };

  if (isEmailSent) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Check your email</CardTitle>
            <CardDescription>
              We sent a password reset link to
              {" "}
              <span className="font-medium text-foreground">
                {getValues("email")}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldDescription className="text-center">
                  Didn&apos;t receive the email? Check your spam folder or
                  {" "}
                  <Button
                    type="button"
                    variant="link"
                    className="h-auto p-0 text-muted-foreground underline underline-offset-4 hover:text-primary"
                    disabled={isLoading}
                    onClick={() => handleSubmit(onSubmit)()}
                  >
                    {isLoading ? "Sending..." : "try again"}
                  </Button>
                </FieldDescription>
              </Field>
              <Field>
                <Button variant="outline" className="w-full" asChild>
                  <Link to={paths.auth.signin.path}>
                    <ArrowLeft className="size-4" />
                    Back to sign in
                  </Link>
                </Button>
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Forgot password?</CardTitle>
          <CardDescription>
            Enter your email and we&apos;ll send you a reset link
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              {/* Email */}
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="email"
                      placeholder="m@example.com"
                      aria-invalid={fieldState.invalid}
                    />
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
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send reset link"}
                </Button>
              </Field>

              {/* Back to sign in */}
              <Field>
                <FieldDescription className="text-center">
                  Remember your password?
                  {" "}
                  <Link to={paths.auth.signin.path}>Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
