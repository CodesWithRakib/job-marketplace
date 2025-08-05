// components/session-sync.tsx
"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { setSession } from "@/redux/slices/auth-slice";

export default function SessionSync() {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // Update Redux store with session data
      dispatch(setSession(session.user));
    }
  }, [session, status, dispatch]);

  // This component doesn't render anything
  return null;
}
