import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerFormSchema, type RegisterFormData, type RegisterRequest } from "@/types/auth"
import { registerUser } from "@/api/auth"
import { Eye, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from '@/context/AuthContext'

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const navigate = useNavigate()
  const { fetchUser } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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
  })

const onSubmit = async (data: RegisterRequest) => {
    try {
      await registerUser(data)
      await fetchUser()
      navigate("/onboarding", { replace: true })
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.detail || "Registration failed. Please try again."
      setError("root", { message: errorMessage })
    }
  }

  return (
    <form
      className={cn("flex flex-col gap-4", className)}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      {...props}
    >
      <FieldGroup className="gap-3.5">
        <div className="flex flex-col items-center gap-1 text-center mb-1">
          <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
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

        {/* EMAIL */}
        <Field className="gap-1.5">
          <FieldLabel htmlFor="email" className="text-xs">Email</FieldLabel>
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
            <p id="email-error" className="text-destructive text-xs font-medium mt-0.5">
              {errors.email.message}
            </p>
          )}
        </Field>

        {/* PASSWORD */}
        <Field className="gap-1.5">
          <FieldLabel htmlFor="password" className="text-xs">Password</FieldLabel>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              className="bg-background h-9 text-sm pr-10"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.password && (
            <p id="password-error" className="text-destructive text-xs font-medium mt-0.5">
              {errors.password.message}
            </p>
          )}
        </Field>

        {/* CONFIRM PASSWORD */}
        <Field className="gap-1.5">
          <FieldLabel htmlFor="confirm-password" className="text-xs">Confirm Password</FieldLabel>
          <div className="relative">
            <Input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
              className="bg-background h-9 text-sm pr-10"
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p id="confirm-password-error" className="text-destructive text-xs font-medium mt-0.5">
              {errors.confirmPassword.message}
            </p>
          )}
        </Field>

        {/* SUBMIT BUTTON */}
        <Field className="pt-1">
          <Button type="submit" className="w-full font-medium h-9 text-sm" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create account"}
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
  )
}