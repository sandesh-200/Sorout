import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginRequest } from "@/types/auth"
import { loginUser } from "@/api/auth"
import { useAuth } from "@/context/AuthContext" // Assuming this path for your AuthContext

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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // 2. Handle Login Submission
const onSubmit = async (data: LoginRequest) => {
  try {
    await loginUser(data);

    const user = await fetchUser();

    if (!user) return;

    if (user.role === "admin") {
      navigate("/admin/dashboard", {
        replace: true,
      });
    } else {
      navigate("/candidate/interviews", {
        replace: true,
      });
    }
  } catch (error) {
    console.error("Login error:", error);
  }
};

  return (
    <form 
      className={cn("flex flex-col gap-6", className)} 
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>

        {/* EMAIL FIELD */}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            className="bg-background border-md"
            {...register("email")} 
          />
          {errors.email && (
            <p className="text-destructive text-sm font-medium mt-1">{errors.email.message}</p>
          )}
        </Field>

        {/* PASSWORD FIELD */}
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Link
              to="/forgot-password"
              className="ml-auto text-sm underline-offset-4 hover:underline text-muted-foreground hover:text-primary"
            >
              Forgot your password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            className="bg-background border-md"
            {...register("password")} // 🔥 Register input
          />
          {errors.password && (
            <p className="text-destructive text-sm font-medium mt-1">{errors.password.message}</p>
          )}
        </Field>

        {/* SUBMIT BUTTON */}
        <Field>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </Field>

        {/* FOOTER LINK */}
        <Field>
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="underline underline-offset-4 hover:text-primary">
              Sign up
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}