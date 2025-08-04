import { signIn, signOut, getSession } from "next-auth/react";

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
    // First register the user with Supabase
    const { data, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data.user) {
      // Create user profile in the users table
      const { error: profileError } = await supabase.from("users").insert([
        {
          id: data.user.id,
          email: data.user.email,
          role: data.role,
          full_name: data.fullName,
        },
      ]);

      if (profileError) {
        throw new Error("Failed to create user profile");
      }

      // Automatically sign in the user after registration
      return await this.login({
        email: data.email,
        password: data.password,
      });
    }

    throw new Error("Registration failed");
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

    const updates: any = {};
    if (data.fullName) updates.full_name = data.fullName;
    if (data.avatarUrl) updates.avatar_url = data.avatarUrl;

    const { error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", session.user.id);

    if (error) {
      throw new Error(error.message);
    }

    // Get updated session
    return await this.getCurrentUser();
  },

  // Logout user
  async logout() {
    await signOut({ redirect: false });
  },
};
