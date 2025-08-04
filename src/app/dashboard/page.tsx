"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; // Or your auth system

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/login");
      return;
    }

    // Redirect based on user role
    switch (session.user.role) {
      case "admin":
        router.push("/dashboard/admin");
        break;
      case "recruiter":
        router.push("/dashboard/recruiter");
        break;
      case "user":
        router.push("/dashboard/user");
        break;
      default:
        router.push("/unauthorized");
    }
  }, [session, status, router]);

  return (
    <div className="flex justify-center items-center h-screen">Loading...</div>
  );
}
