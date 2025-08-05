import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { authService, LoginCredentials, RegisterData } from "@/services/auth";
import { getSession } from "next-auth/react";

interface AuthState {
  user: {
    id: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
    role: string;
  } | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

// Action to set user from NextAuth session
export const setUser = createAsyncThunk(
  "auth/setUser",
  async (_, { rejectWithValue }) => {
    try {
      const session = await getSession();
      if (session?.user) {
        return {
          id: session.user.id || session.user.email || "",
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
          role: (session.user as any).role || "user",
        };
      }
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to set user");
    }
  }
);
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      await authService.login(credentials);
      const session = await getSession();
      return session?.user || null;
    } catch (error: any) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      await authService.register(data);
      const session = await getSession();
      return session?.user || null;
    } catch (error: any) {
      return rejectWithValue(error.message || "Registration failed");
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const session = await authService.getCurrentUser();
      if (session?.user) {
        return {
          id: session.user.id || session.user.email || "",
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
          role: (session.user as any).role || "user",
        };
      }
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch user");
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (
    data: { fullName?: string; avatarUrl?: string },
    { rejectWithValue }
  ) => {
    try {
      await authService.updateProfile(data);
      const session = await getSession();
      if (session?.user) {
        return {
          id: session.user.id || session.user.email || "",
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
          role: (session.user as any).role || "user",
        };
      }
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update profile");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message || "Logout failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Direct setter for user (used when we already have the user data)
    setUserDirect: (state, action: PayloadAction<AuthState["user"]>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    // Set session data from NextAuth
    setSession: (state, action: PayloadAction<any>) => {
      if (action.payload) {
        state.user = {
          id: action.payload.id || action.payload.email || "",
          email: action.payload.email,
          name: action.payload.name,
          image: action.payload.image,
          role: action.payload.role || "user",
        };
        state.isAuthenticated = true;
      } else {
        state.user = null;
        state.isAuthenticated = false;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Set user from session
      .addCase(setUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(setUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(setUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Fetch current user
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
      })
      // Update profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setUserDirect, setSession } = authSlice.actions;
export default authSlice.reducer;
