"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/auth-slice";

export default function HomePage() {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  useEffect(() => {
    if (session) {
      dispatch(setUser(session.user));
    }
  }, [session, dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Find Your Dream Job</span>
            <span className="block text-indigo-600 mt-2">
              Or Ideal Candidate
            </span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Connecting job seekers with employers in a seamless and efficient
            platform.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Button asChild size="lg" className="w-full">
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Button asChild variant="outline" size="lg" className="w-full">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-16">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 sm:text-4xl">
            How It Works
          </h2>
          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>For Job Seekers</CardTitle>
                  <CardDescription>
                    Create a profile, browse jobs, and apply with just a few
                    clicks.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href="/register?role=user">Get Started</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>For Recruiters</CardTitle>
                  <CardDescription>
                    Post jobs, review applications, and find the perfect
                    candidates.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href="/register?role=recruiter">Get Started</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Real-time Chat</CardTitle>
                  <CardDescription>
                    Communicate directly with candidates or employers through
                    our chat system.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href={isAuthenticated ? "/chat" : "/register"}>
                      {isAuthenticated ? "Go to Chat" : "Learn More"}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
