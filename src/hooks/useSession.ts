// hooks/useSession.ts
import { useSession as useNextAuthSession } from "next-auth/react";

interface ExtendedSession {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    status: string;
    profile: string;
    image?: string;
  };
}

export const useSession = () => {
  const { data: session, status } = useNextAuthSession() as {
    data: ExtendedSession | null;
    status: "loading" | "authenticated" | "unauthenticated";
  };

  return {
    session,
    status,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
  };
};
