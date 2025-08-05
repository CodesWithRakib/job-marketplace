import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { getSession } from "next-auth/react";
import { setUser } from "@/redux/slices/auth-slice";

export function useAuth() {
  const dispatch = useDispatch();
  const { user, isLoading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    const checkAuth = async () => {
      const session = await getSession();

      // If we have a session user but no user in Redux state
      if (session?.user && !user && !isLoading && !error && !isAuthenticated) {
        // Map NextAuth session user to your Redux user format
        const mappedUser = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
          role: session.user.role,
        };

        // Set the user in Redux state
        dispatch(setUser(mappedUser));

        // Optionally fetch additional user data from your API
        // dispatch(fetchCurrentUser());
      }
    };

    checkAuth();
  }, [dispatch, user, isLoading, error, isAuthenticated]);

  // Helper functions
  const isAdmin = user?.role === "admin";
  const isRecruiter = user?.role === "recruiter";
  const isUser = user?.role === "user";

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
    isRecruiter,
    isUser,
  };
}
