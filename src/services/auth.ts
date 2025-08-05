// services/auth.ts
import { signIn, signOut, getSession } from "next-auth/react";
import api from "@/lib/api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  role: string;
}

export const authService = {
  async login(credentials: LoginCredentials) {
    try {
      console.log("Attempting login with:", credentials.email);

      const result = await signIn("credentials", {
        redirect: false,
        email: credentials.email,
        password: credentials.password,
      });

      console.log("Login result:", result);

      if (result?.error) {
        console.error("Login error from NextAuth:", result.error);
        throw new Error(result.error);
      }

      return result;
    } catch (error: any) {
      console.error("Login error in auth service:", error);
      throw new Error(error.message || "Login failed");
    }
  },

  async register(data: RegisterData) {
    try {
      console.log("Registering with data:", data);

      // Check if we're in a browser environment
      if (typeof window === "undefined") {
        throw new Error("Registration must be called from the client side");
      }

      // First, register the user
      const registerResponse = await api.post("/auth/register", data);
      console.log("Registration response:", registerResponse);

      // Only attempt to login if registration was successful
      if (registerResponse.status === 200 || registerResponse.status === 201) {
        // Add a small delay to ensure the user is saved in the database
        await new Promise((resolve) => setTimeout(resolve, 500));

        try {
          // Then attempt to log in
          await this.login({ email: data.email, password: data.password });
        } catch (loginError) {
          console.error("Auto-login after registration failed:", loginError);
          // Don't throw here - registration was successful, we'll let the user log in manually
        }
      }

      return registerResponse.data;
    } catch (error: any) {
      console.error("Registration error in auth service:", error);

      // Check if it's an axios error with a response
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);

        // Handle 404 error specifically
        if (error.response.status === 404) {
          throw new Error(
            "Registration endpoint not found. Please check your API route configuration."
          );
        }

        throw new Error(error.response.data.error || "Registration failed");
      } else if (error.request) {
        console.error("No response received:", error.request);
        throw new Error(
          "No response from server. Please check your connection."
        );
      } else {
        console.error("Error setting up request:", error.message);
        throw new Error(error.message || "Registration failed");
      }
    }
  },

  async logout() {
    try {
      await signOut({ redirect: false });
      // Clear any stored tokens
      if (typeof window !== "undefined") {
        localStorage.removeItem("nextauth.token");
      }
    } catch (error: any) {
      console.error("Logout error in auth service:", error);
      throw new Error(error.message || "Logout failed");
    }
  },

  async getCurrentUser() {
    try {
      const session = await getSession();
      return session;
    } catch (error: any) {
      console.error("Get current user error in auth service:", error);
      throw new Error(error.message || "Failed to get current user");
    }
  },

  async updateProfile(data: { fullName?: string; avatarUrl?: string }) {
    try {
      const session = await getSession();
      if (!session?.user?.id) {
        throw new Error("User not authenticated");
      }

      const response = await api.put("/auth/user", data, {
        headers: {
          Authorization: `Bearer ${session.user.id}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.error("Update profile error in auth service:", error);
      throw new Error(error.response?.data?.error || "Profile update failed");
    }
  },
};
