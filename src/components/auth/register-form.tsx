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
import {
  Eye,
  EyeOff,
  Loader2,
  User,
  Briefcase,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Define the schema with proper validation
const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  name: z.string().min(2, "Full name must be at least 2 characters"),
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

  // Map URL role parameter to schema values
  const roleParam =
    searchParams.get("role") === "recruiter" ? "recruiter" : "user";

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
      name: "",
      role: roleParam,
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
    <Card className="w-full max-w-md shadow-xl border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg">
      <CardHeader className="space-y-1 pb-6">
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-full shadow-lg">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Create Your Account
        </CardTitle>
        <CardDescription className="text-center text-gray-600 dark:text-gray-300 max-w-xs mx-auto">
          Join our platform to find your dream job or ideal candidate
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Full Name Field */}
          <div className="space-y-2">
            <Label
              htmlFor="fullName"
              className="text-gray-700 dark:text-gray-300 font-medium"
            >
              Full Name
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              {...register("name")}
              aria-invalid={!!errors.name}
              disabled={isLoading}
              className={cn(
                "h-11 transition-all duration-200",
                errors.name
                  ? "border-red-500 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-900/30"
                  : "border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-200 dark:focus:ring-indigo-900/30"
              )}
            />
            {errors.name && (
              <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-gray-700 dark:text-gray-300 font-medium"
            >
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              {...register("email")}
              aria-invalid={!!errors.email}
              disabled={isLoading}
              className={cn(
                "h-11 transition-all duration-200",
                errors.email
                  ? "border-red-500 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-900/30"
                  : "border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-200 dark:focus:ring-indigo-900/30"
              )}
            />
            {errors.email && (
              <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                className="text-gray-700 dark:text-gray-300 font-medium"
              >
                Password
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={togglePasswordVisibility}
                className="h-auto p-0 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
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
                className={cn(
                  "h-11 transition-all duration-200 pr-12",
                  errors.password
                    ? "border-red-500 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-900/30"
                    : "border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-200 dark:focus:ring-indigo-900/30"
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={togglePasswordVisibility}
                className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                {errors.password.message}
              </p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Must be at least 8 characters with uppercase, lowercase, and
              number
            </p>
          </div>

          {/* Role Field */}
          <div className="space-y-3">
            <Label className="text-gray-700 dark:text-gray-300 font-medium">
              I am a
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={selectedRole === "user" ? "default" : "outline"}
                className={cn(
                  "h-12 flex items-center justify-center gap-2 transition-all duration-200",
                  selectedRole === "user"
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                    : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-700/50"
                )}
                onClick={() => setValue("role", "user")}
                disabled={isLoading}
              >
                <User className="h-5 w-5" />
                Job Seeker
              </Button>
              <Button
                type="button"
                variant={selectedRole === "recruiter" ? "default" : "outline"}
                className={cn(
                  "h-12 flex items-center justify-center gap-2 transition-all duration-200",
                  selectedRole === "recruiter"
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                    : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-700/50"
                )}
                onClick={() => setValue("role", "recruiter")}
                disabled={isLoading}
              >
                <Briefcase className="h-5 w-5" />
                Recruiter
              </Button>
            </div>
            <input type="hidden" {...register("role")} />
            {errors.role && (
              <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                {errors.role.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-md transition-all duration-300 mt-4"
            disabled={isLoading}
          >
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

        <div className="text-center text-sm text-gray-600 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
          By creating an account, you agree to our{" "}
          <Link
            href="/terms"
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
          >
            Privacy Policy
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
