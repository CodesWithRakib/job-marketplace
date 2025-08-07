// app/dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { setSession } from "@/redux/slices/authSlice";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { user, isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // If session is available but Redux is not updated, update Redux
    if (session?.user && !isAuthenticated && !isLoading) {
      console.log("Updating Redux with session data");
      dispatch(setSession(session.user));
    }

    // Mark as initialized after checking
    setIsInitialized(true);
  }, [session, isAuthenticated, isLoading, dispatch]);

  useEffect(() => {
    // Wait until we've checked the session and updated Redux
    if (!isInitialized) return;

    // If still loading, do nothing
    if (status === "loading" || isLoading) return;

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // If user has a role, redirect to role-based dashboard
    if (user?.role) {
      router.push(`/dashboard/${user?.role}`);
      return;
    }

    // If we have session data but no role in Redux, try to get it from session
    if (session?.user?.role) {
      router.push(`/dashboard/${session.user.role}`);
      return;
    }

    // If no role found, redirect to login
    router.push("/login");
  }, [
    router,
    session,
    status,
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
  ]);

  // Debug logging
  console.log("Session data:", session);
  console.log("User from Redux:", user);
  console.log("Is authenticated:", isAuthenticated);
  console.log("Loading state:", isLoading);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
