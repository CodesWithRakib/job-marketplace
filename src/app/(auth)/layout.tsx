// app/(auth)/layout.tsx
"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Toaster } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";
  const formType = pathname.includes("login") ? "login" : "register";
  const role = searchParams.get("role");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          <h1 className="text-3xl font-bold mt-4 text-indigo-700">
            Job Marketplace
          </h1>
          <p className="text-gray-600 mt-2">
            Find your dream job or ideal candidate
          </p>
        </div>

        {children}

        <div className="mt-6 text-center text-sm">
          {formType === "login" ? (
            <p>
              Don&apos;t have an account?{" "}
              <Link
                href={`/register${role ? `?role=${role}` : ""}`}
                className="font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                Sign up
              </Link>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                Sign in
              </Link>
            </p>
          )}
        </div>
      </div>
      <Toaster />
    </div>
  );
}
