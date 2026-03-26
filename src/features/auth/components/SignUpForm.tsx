import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
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

import type { SignUpFormValues } from "../schemas";

import { useSignUpMutation } from "../api";
import { signUpSchema } from "../schemas";

type SignUpFormProps = {
  className?: string;
  [key: string]: unknown;
};

export function SignUpForm({ className, ...props }: SignUpFormProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [signUp, { isLoading: isSubmitting }] = useSignUpMutation();

  const {
    control,
    setError,
    handleSubmit,
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [visible, setVisible] = useState({
    password: false,
    confirm: false,
  });

  const handleToggle = (field: "password" | "confirm") => {
    setVisible(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const onSubmit = async (values: SignUpFormValues) => {
    try {
      const { confirmPassword: _, ...payload } = values;
      const { data, message } = await signUp(payload).unwrap();

      toast.success(message);

      const redirectTo = searchParams.get("redirectTo") ?? ROLE_HOME_ROUTE[data.user.role];
      navigate(redirectTo, { replace: true });
    }
    catch (err) {
      const { message, fieldErrors } = parseApiError<SignUpFormValues>(err);

      // Set field-level errors
      Object.entries(fieldErrors).forEach(([field, msg]) => {
        setError(field as keyof SignUpFormValues, {
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
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create an account</CardTitle>
          <CardDescription>
            Get started with WorkSphere today.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>

              {/* Name */}
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="text"
                      placeholder="Alice Admin"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

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
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id={field.name}
                        type={visible.password ? "text" : "password"}
                        aria-invalid={fieldState.invalid}
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupButton
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          aria-label={visible.password ? "Hide password" : "Show password"}
                          onClick={() => handleToggle("password")}
                        >
                          {visible.password ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
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
                    <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id={field.name}
                        type={visible.confirm ? "text" : "password"}
                        aria-invalid={fieldState.invalid}
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupButton
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          aria-label={visible.confirm ? "Hide password" : "Show password"}
                          onClick={() => handleToggle("confirm")}
                        >
                          {visible.confirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
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
                  {isSubmitting ? "Creating account..." : "Create Account"}
                </Button>
                <FieldDescription className="text-center">
                  Already have an account?
                  {" "}
                  <Link to={paths.auth.signin.path}>Sign in</Link>
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
        <a href="#">Privacy Policy</a>
        .
      </FieldDescription>
    </div>
  );
}
