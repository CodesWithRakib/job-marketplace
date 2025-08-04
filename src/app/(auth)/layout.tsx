import { ReactNode } from "react";
import Link from "next/link";
import { Toaster } from "sonner";

interface AuthLayoutProps {
  children: ReactNode;
  formType: "login" | "register";
}

export default function AuthLayout({ children, formType }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Job Marketplace</h1>
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
                href="/register"
                className="font-medium text-primary hover:underline"
              >
                Sign up
              </Link>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
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
