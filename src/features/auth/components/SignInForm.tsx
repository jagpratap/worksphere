import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Info } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router";
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { paths } from "@/config/paths";
import { ROLE_HOME_ROUTE } from "@/config/roles";
import { cn } from "@/lib/utils";
import { parseApiError } from "@/utils/error";

import type { SignInFormValues } from "../schemas";

import { useSignInMutation } from "../api";
import { signInSchema } from "../schemas";

const TEST_ACCOUNTS = [
  { role: "Admin", email: "admin@worksphere.dev", access: "Full access" },
  { role: "Manager", email: "bob@worksphere.dev", access: "Projects & teams" },
  { role: "Member", email: "carol@worksphere.dev", access: "Tasks & time" },
] as const;

type SignInFormProps = {
  className?: string;
  [key: string]: unknown;
};

export function SignInForm({ className, ...props }: SignInFormProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [signIn, { isLoading }] = useSignInMutation();

  const {
    control,
    setError,
    setValue,
    handleSubmit,
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const fillCredentials = (email: string) => {
    setValue("email", email);
    setValue("password", "password123");
  };

  const onSubmit = async (values: SignInFormValues) => {
    try {
      const { data, message } = await signIn(values).unwrap();

      toast.success(message);

      const redirectTo = searchParams.get("redirectTo") ?? ROLE_HOME_ROUTE[data.user.role];
      navigate(redirectTo, { replace: true });
    }
    catch (err) {
      const { message, fieldErrors } = parseApiError<SignInFormValues>(err);

      // Set field-level errors
      Object.entries(fieldErrors).forEach(([field, msg]) => {
        setError(field as keyof SignInFormValues, {
          type: "server",
          message: msg,
        });
      });

      // Set general error
      if (Object.keys(fieldErrors).length === 0) {
        toast.error(message);
      }
    }
  };

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      {/* Demo Notice */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <div className="mb-2 flex items-center gap-2">
          <Info className="size-4 text-primary" />
          <span className="text-sm font-medium">Demo Mode</span>
        </div>
        <p className="mb-3 text-xs text-muted-foreground">
          This app uses a mock API (MSW) — no real server. Data persists in localStorage.
          Click any role below to auto-fill credentials.
        </p>
        <div className="grid gap-1.5">
          {TEST_ACCOUNTS.map(account => (
            <button
              key={account.role}
              type="button"
              className="flex items-center justify-between rounded-md border bg-background px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
              onClick={() => fillCredentials(account.email)}
            >
              <div className="flex items-center gap-2">
                <span className="w-16 font-medium">{account.role}</span>
                <span className="text-xs text-muted-foreground">{account.email}</span>
              </div>
              <span className="text-xs text-muted-foreground">{account.access}</span>
            </button>
          ))}
        </div>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          Password for all accounts:
          {" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono">password123</code>
        </p>
      </div>

      {/* Sign In Form */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Sign in with your email and password</CardDescription>
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

              {/* Password */}
              <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex items-center">
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                      <Link
                        to={paths.auth.forgotPassword.path}
                        className="ml-auto text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
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

              {/* Submit */}
              <Field>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account?
                  {" "}
                  <Link to={paths.auth.signup.path}>Sign up</Link>
                </FieldDescription>
              </Field>

            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our
        {" "}
        <a href="#">Terms of Service</a>
        {" "}
        and
        {" "}
        <a href="#">Privacy Policy</a>
        .
      </FieldDescription>
    </div>
  );
}
