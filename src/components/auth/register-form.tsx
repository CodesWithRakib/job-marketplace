"use client";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setSession } from "@/redux/slices/authSlice";
import { getSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { authService } from "@/services/auth";
import { Eye, EyeOff, Loader2, User, Briefcase } from "lucide-react";
import Link from "next/link";

// Define the schema with proper validation
const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(1, "Full name is required"),
  role: z.enum(["user", "recruiter"], {
    required_error: "Please select a role",
  }),
});

// Type inference from schema
type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const roleParam = searchParams.get("role") || "user";

  // Initialize form with proper types
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      role: roleParam as "user" | "recruiter",
    },
  });

  const selectedRole = watch("role");

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    setIsLoading(true);
    try {
      console.log("Submitting registration with data:", data);
      // Register using auth service
      await authService.register(data);

      // Get session after registration and login
      const session = await getSession();
      console.log("Session after registration:", session);

      if (session?.user) {
        // Update Redux state with user data
        dispatch(setSession(session.user));
        toast.success("Registration and login successful!");
        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        // Registration was successful but auto-login failed
        toast.success(
          "Registration successful! Please log in with your new account."
        );
        router.push("/login");
      }
      // Reset form
      reset();
    } catch (error: any) {
      console.error("Registration error in form:", error);
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Create Account
        </CardTitle>
        <CardDescription className="text-center">
          Join our platform to find your dream job or ideal candidate
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name Field */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              {...register("fullName")}
              aria-invalid={!!errors.fullName}
              disabled={isLoading}
              className={errors.fullName ? "border-red-500" : ""}
            />
            {errors.fullName && (
              <p className="text-sm text-red-500">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              {...register("email")}
              aria-invalid={!!errors.email}
              disabled={isLoading}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={togglePasswordVisibility}
                className="h-auto p-0 text-xs"
              >
                {showPassword ? "Hide" : "Show"}
              </Button>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                aria-invalid={!!errors.password}
                disabled={isLoading}
                className={errors.password ? "border-red-500" : ""}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={togglePasswordVisibility}
                className="absolute right-0 top-0 h-full px-3"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Role Field */}
          <div className="space-y-2">
            <Label>I am a</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={selectedRole === "user" ? "default" : "outline"}
                className="flex items-center justify-center"
                onClick={() => setValue("role", "user")}
                disabled={isLoading}
              >
                <User className="mr-2 h-4 w-4" />
                Job Seeker
              </Button>
              <Button
                type="button"
                variant={selectedRole === "recruiter" ? "default" : "outline"}
                className="flex items-center justify-center"
                onClick={() => setValue("role", "recruiter")}
                disabled={isLoading}
              >
                <Briefcase className="mr-2 h-4 w-4" />
                Recruiter
              </Button>
            </div>
            <input type="hidden" {...register("role")} />
            {errors.role && (
              <p className="text-sm text-red-500">{errors.role.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-600">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
