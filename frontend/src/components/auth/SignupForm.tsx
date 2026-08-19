
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  registerFormSchema,
  type RegisterFormData,
  type RegisterRequest,
} from "@/types/auth";

import { registerUser } from "@/api/auth";
import { joinLinkAPI } from "@/features/joinLink/joinLinkAPI";

import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { getApiErrorMessage } from "@/utils/api-error";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const navigate = useNavigate();
  const { fetchUser } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [joinToken, setJoinToken] = useState<string | null>(null);
  const [organizationName, setOrganizationName] = useState<string | null>(
    null
  );

  const [joinLinkLoading, setJoinLinkLoading] = useState(false);
  const [joinLinkError, setJoinLinkError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  /*
   * Check whether the user arrived through an organization
   * join link.
   *
   * The token is no longer read from the URL.
   *
   * JoinPage already stored it here:
   *
   * sessionStorage.setItem("join_token", token)
   */
  useEffect(() => {
    const token = sessionStorage.getItem("join_token");

    if (!token) {
      return;
    }

    setJoinToken(token);

    const loadJoinLink = async () => {
      try {
        setJoinLinkLoading(true);
        setJoinLinkError(null);

        const response = await joinLinkAPI.preview(token);

        if (!response.data.is_valid) {
          setJoinLinkError(
            "This organization join link is invalid or has expired."
          );
          return;
        }

        setOrganizationName(response.data.organization_name);
      } catch (error) {
        console.error("Failed to preview join link", error);

        setJoinLinkError(
          "This organization join link is invalid or has expired."
        );
      } finally {
        setJoinLinkLoading(false);
      }
    };

    loadJoinLink();
  }, []);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const registerData: RegisterRequest = {
        email: data.email,
        password: data.password,
        send_verification: data.send_verification,
      };

      /*
       * Registration itself does NOT accept an invitation token anymore.
       *
       * The account is created first.
       *
       * The join token remains in sessionStorage and will be consumed
       * during the onboarding/join flow.
       */
      await registerUser(registerData);

      const user = await fetchUser();

      if (!user) {
        setError("root", {
          message:
            "Unable to retrieve your account session. Please try again.",
        });
        return;
      }

      /*
       * Do not put the token back into the URL.
       *
       * Onboarding will read it from sessionStorage.
       */
      navigate("/onboarding", { replace: true });
    } catch (error: unknown) {
      console.error("Registration error:", error);

      setError("root", {
        message: getApiErrorMessage(
          error,
          "Registration failed. Please try again."
        ),
      });
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-4", className)}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      {...props}
    >
      <FieldGroup className="gap-3.5">
        <div className="flex flex-col items-center gap-1 text-center mb-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Create your account
          </h1>

          <p className="text-xs text-balance text-muted-foreground">
            Enter your details below to get started with Sorout
          </p>
        </div>

        {/* TOP-LEVEL AUTHENTICATION ERROR */}
        {errors.root && (
          <div
            role="alert"
            className="rounded-md bg-destructive/10 border border-destructive/20 p-2.5 text-xs font-medium text-destructive text-center"
          >
            {errors.root.message}
          </div>
        )}

        {/* JOIN LINK VALIDATION */}
        {joinToken && joinLinkLoading && (
          <p className="text-center text-xs text-muted-foreground">
            Validating your organization invitation...
          </p>
        )}

        {joinLinkError && (
          <div className="rounded-md bg-destructive/10 border border-destructive/20 p-2.5 text-xs font-medium text-destructive text-center">
            {joinLinkError}
          </div>
        )}

        {joinToken && organizationName && (
          <div className="rounded-md border border-border bg-muted/30 p-3 text-center">
            <p className="text-xs text-muted-foreground">
              You're joining
            </p>

            <p className="text-sm font-medium text-foreground mt-0.5">
              {organizationName}
            </p>

            <p className="text-xs text-muted-foreground mt-1">
              You'll join this organization as a candidate.
            </p>
          </div>
        )}

        {/* EMAIL */}
        <Field className="gap-1.5">
          <FieldLabel htmlFor="email" className="text-xs">
            Email
          </FieldLabel>

          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="bg-background h-9 text-sm"
            {...register("email")}
          />

          {errors.email && (
            <p
              id="email-error"
              className="text-destructive text-xs font-medium mt-0.5"
            >
              {errors.email.message}
            </p>
          )}
        </Field>

        {/* PASSWORD */}
        <Field className="gap-1.5">
          <FieldLabel htmlFor="password" className="text-xs">
            Password
          </FieldLabel>

          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password ? "password-error" : undefined
              }
              className="bg-background h-9 text-sm pr-10"
              {...register("password")}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
              aria-label={
                showPassword ? "Hide password" : "Show password"
              }
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>

          {errors.password && (
            <p
              id="password-error"
              className="text-destructive text-xs font-medium mt-0.5"
            >
              {errors.password.message}
            </p>
          )}
        </Field>

        {/* CONFIRM PASSWORD */}
        <Field className="gap-1.5">
          <FieldLabel htmlFor="confirm-password" className="text-xs">
            Confirm Password
          </FieldLabel>

          <div className="relative">
            <Input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={
                errors.confirmPassword
                  ? "confirm-password-error"
                  : undefined
              }
              className="bg-background h-9 text-sm pr-10"
              {...register("confirmPassword")}
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
            >
              {showConfirmPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>

          {errors.confirmPassword && (
            <p
              id="confirm-password-error"
              className="text-destructive text-xs font-medium mt-0.5"
            >
              {errors.confirmPassword.message}
            </p>
          )}
        </Field>

        {/* SUBMIT BUTTON */}
        <Field className="pt-1">
          <Button
            type="submit"
            className="w-full font-medium h-9 text-sm"
            disabled={
              isSubmitting ||
              joinLinkLoading ||
              !!joinLinkError
            }
          >
            {isSubmitting
              ? "Creating account..."
              : "Create account"}
          </Button>
        </Field>

        {/* FOOTER LINK */}
        <Field>
          <FieldDescription className="text-center text-xs">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium underline underline-offset-4 hover:text-primary transition-colors"
            >
              Sign in
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}

