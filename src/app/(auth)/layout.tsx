"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Toaster } from "sonner";
import {
  ArrowLeft,
  Briefcase,
  Users,
  Building,
  Search,
  UserCheck,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";
  const formType = pathname.includes("login") ? "login" : "register";
  const role = searchParams.get("role");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden p-4 transition-colors duration-300">
      {/* Sophisticated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900" />

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 bg-grid-slate-200/[0.05] dark:bg-grid-slate-800/[0.1] bg-[length:20px_20px]" />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/20 dark:to-black/30" />

      {/* Floating Icons */}
      <div className="absolute top-20 left-10 text-blue-200/30 dark:text-purple-300/20 animate-pulse">
        <Briefcase size={48} strokeWidth={1.5} />
      </div>
      <div className="absolute bottom-20 right-10 text-indigo-200/30 dark:text-blue-300/20 animate-pulse">
        <Users size={48} strokeWidth={1.5} />
      </div>
      <div className="absolute top-1/3 right-20 text-blue-300/30 dark:text-indigo-300/20 animate-pulse">
        <Building size={48} strokeWidth={1.5} />
      </div>
      <div className="absolute bottom-1/3 left-20 text-indigo-300/30 dark:text-blue-300/20 animate-pulse">
        <Search size={48} strokeWidth={1.5} />
      </div>
      <div className="absolute top-1/2 right-1/3 text-purple-300/30 dark:text-indigo-300/20 animate-pulse">
        <UserCheck size={48} strokeWidth={1.5} />
      </div>

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-full shadow-md hover:shadow-lg transition-all"
        >
          <Sun className="h-5 w-5 text-amber-500 dark:hidden" />
          <Moon className="h-5 w-5 text-indigo-300 hidden dark:block" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>

      {/* Content Container */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg rounded-2xl shadow-xl dark:shadow-2xl p-8 border border-white/20 dark:border-slate-700/50 transition-all duration-300 hover:shadow-indigo-500/10 dark:hover:shadow-purple-500/10">
          <div className="text-center mb-8">
            <Button variant="ghost" asChild className="mb-4 group">
              <Link
                href="/"
                className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Back to Home</span>
              </Link>
            </Button>

            <div className="mt-6 flex justify-center">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-full shadow-lg dark:shadow-indigo-500/20">
                <Briefcase className="h-12 w-12 text-white" />
              </div>
            </div>

            <h1 className="text-3xl font-bold mt-6 bg-gradient-to-r from-indigo-700 to-purple-700 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              Job Marketplace
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-3 max-w-xs mx-auto">
              {role === "employer"
                ? "Find your ideal candidate and build your dream team"
                : role === "jobseeker"
                ? "Discover your dream job and advance your career"
                : "Connecting talented professionals with amazing opportunities"}
            </p>
          </div>

          {children}

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-700 text-center text-sm">
            {formType === "login" ? (
              <p className="text-gray-600 dark:text-gray-300">
                Don&apos;t have an account?{" "}
                <Button
                  variant="link"
                  asChild
                  className="p-0 h-auto font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                >
                  <Link href={`/register${role ? `?role=${role}` : ""}`}>
                    Sign up
                    <span className="ml-1">→</span>
                  </Link>
                </Button>
              </p>
            ) : (
              <p className="text-gray-600 dark:text-gray-300">
                Already have an account?{" "}
                <Button
                  variant="link"
                  asChild
                  className="p-0 h-auto font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                >
                  <Link href={`/login${role ? `?role=${role}` : ""}`}>
                    Sign in
                    <span className="ml-1">→</span>
                  </Link>
                </Button>
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500 dark:text-gray-400 text-xs">
          <p>© 2023 Job Marketplace. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <Link
              href="/privacy"
              className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  );
}
