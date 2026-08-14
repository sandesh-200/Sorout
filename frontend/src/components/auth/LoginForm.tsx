import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginRequest } from "@/types/auth"
import { loginUser } from "@/api/auth"
import { useAuth } from "@/context/AuthContext"
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

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const navigate = useNavigate()
  const { fetchUser } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginRequest) => {
    try {
      await loginUser(data)
      const user = await fetchUser()

      if (!user) {
        setError("root", {
          message: "Unable to retrieve user session. Please try again.",
        })
        return
      }

      if (user.role === "admin") {
        navigate("/admin/interviews", { replace: true })
      } else {
        navigate("/candidate/interviews", { replace: true })
      }
    } catch (error: any) {
      console.error("Login error:", error)
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Invalid email or password. Please try again."

      setError("root", { message: errorMessage })
    }
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1.5 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Sign in to Sorout</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your details below to access your account
          </p>
        </div>

        {/* TOP-LEVEL AUTHENTICATION ERROR */}
        {errors.root && (
          <div
            role="alert"
            className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-xs font-medium text-destructive text-center"
          >
            {errors.root.message}
          </div>
        )}

        {/* EMAIL FIELD */}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="bg-background"
            {...register("email")}
          />
          {errors.email && (
            <p id="email-error" className="text-destructive text-xs font-medium mt-1">
              {errors.email.message}
            </p>
          )}
        </Field>

        {/* PASSWORD FIELD */}
        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Link
              to="/forgot-password"
              className="text-xs text-muted-foreground underline-offset-4 hover:underline hover:text-primary transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              className="bg-background pr-10"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p id="password-error" className="text-destructive text-xs font-medium mt-1">
              {errors.password.message}
            </p>
          )}
        </Field>

        {/* SUBMIT BUTTON */}
        <Field className="pt-1">
          <Button type="submit" className="w-full font-medium" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </Field>

        {/* FOOTER LINK */}
        <Field>
          <FieldDescription className="text-center text-xs">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="font-medium underline underline-offset-4 hover:text-primary transition-colors"
            >
              Sign up
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}