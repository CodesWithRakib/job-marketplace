import { signIn, signOut, getSession } from "next-auth/react";
import api from "@/lib/api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  role: "user" | "recruiter";
  fullName: string;
}

export interface UserProfile {
  id: string;
  email: string;
  role: "admin" | "recruiter" | "user";
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export const authService = {
  // Login user
  async login(credentials: LoginCredentials) {
    const result = await signIn("credentials", {
      email: credentials.email,
      password: credentials.password,
      redirect: false,
    });

    if (result?.error) {
      throw new Error(result.error);
    }

    return result;
  },

  // Register new user
  async register(data: RegisterData) {
    // First, create the user in our database via API
    const response = await api.post("/auth/register", data);

    if (response.data.error) {
      throw new Error(response.data.error);
    }

    // Then, sign in the user
    return await this.login({
      email: data.email,
      password: data.password,
    });
  },

  // Get current user
  async getCurrentUser() {
    const session = await getSession();
    return session;
  },

  // Update user profile
  async updateProfile(data: { fullName?: string; avatarUrl?: string }) {
    const session = await getSession();
    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    const response = await api.put("/auth/user", data);

    if (response.data.error) {
      throw new Error(response.data.error);
    }

    // Get updated session
    return await this.getCurrentUser();
  },

  // Logout user
  async logout() {
    await signOut({ redirect: false });
  },
};
