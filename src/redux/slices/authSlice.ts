import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { authService, LoginCredentials, RegisterData } from "@/services/auth";
import { getSession } from "next-auth/react";
import { User, UserProfile } from "@/shared/interfaces";

interface AuthState {
  user: User | null;
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

// Helper function to extract user data from session
const extractUserFromSession = (session: any): User | null => {
  if (!session?.user) return null;

  return {
    id: session.user.id || session.user.email || "",
    email: session.user.email || "",
    name: session.user.name || "",
    image: session.user.image || "",
    role: (session.user as any).role || "user",
    status: (session.user as any).status || "active",
    profile: (session.user as any).profile || {},
    createdAt: session.user.createdAt || new Date().toISOString(),
    updatedAt: session.user.updatedAt || new Date().toISOString(),
  };
};

// Thunks
export const setUser = createAsyncThunk(
  "auth/setUser",
  async (_, { rejectWithValue }) => {
    try {
      const session = await getSession();
      return extractUserFromSession(session);
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
      return extractUserFromSession(session);
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
      return extractUserFromSession(session);
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
      return extractUserFromSession(session);
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch user");
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (
    {
      userId,
      profileData,
    }: { userId: string; profileData: Partial<UserProfile> },
    { rejectWithValue }
  ) => {
    try {
      await authService.updateProfile({ userId, profileData });
      const session = await getSession();
      return extractUserFromSession(session);
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update profile");
    }
  }
);

export const changeUserPassword = createAsyncThunk(
  "auth/changeUserPassword",
  async (
    {
      userId,
      currentPassword,
      newPassword,
    }: { userId: string; currentPassword: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      await authService.changePassword({
        userId,
        currentPassword,
        newPassword,
      });
      return { success: true };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to change password");
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
    setUserDirect: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setSession: (state, action: PayloadAction<any>) => {
      if (action.payload) {
        state.user = extractUserFromSession(action.payload);
        state.isAuthenticated = true;
      } else {
        state.user = null;
        state.isAuthenticated = false;
      }
    },
    updateProfileLocally: (
      state,
      action: PayloadAction<Partial<UserProfile>>
    ) => {
      if (state.user) {
        state.user.profile = { ...state.user.profile, ...action.payload };
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
      // Change password
      .addCase(changeUserPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changeUserPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(changeUserPassword.rejected, (state, action) => {
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

export const { clearError, setUserDirect, setSession, updateProfileLocally } =
  authSlice.actions;
export default authSlice.reducer;
