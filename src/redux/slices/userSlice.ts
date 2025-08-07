import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/api";
import { User, UserProfile } from "@/shared/interfaces";

interface UserState {
  entities: Record<string, User>;
  ui: {
    isLoading: boolean;
    error: string | null;
  };
}

const initialState: UserState = {
  entities: {},
  ui: {
    isLoading: false,
    error: null,
  },
};

// Thunks
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/users");
      return response.data.users as User[];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch users"
      );
    }
  }
);

export const createUser = createAsyncThunk(
  "users/createUser",
  async (userData: any, { rejectWithValue }) => {
    try {
      const response = await api.post("/admin/users", userData);
      return response.data.user as User;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to create user"
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (
    { userId, userData }: { userId: string; userData: Partial<User> },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(`/admin/users/${userId}`, userData);
      return response.data.user as User;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update user"
      );
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  "users/updateUserStatus",
  async (
    { userId, status }: { userId: string; status: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.patch(`/admin/users/${userId}/status`, {
        status,
      });
      return response.data.user as User;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update user status"
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/users/${userId}`);
      return userId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to delete user"
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "users/updateUserProfile",
  async (
    {
      userId,
      profileData,
    }: { userId: string; profileData: Partial<UserProfile> },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(`/user/profile/${userId}`, profileData);
      return response.data.user as User;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update user profile"
      );
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearError: (state) => {
      state.ui.error = null;
    },
    updateUserLocally: (
      state,
      action: PayloadAction<{ userId: string; userData: Partial<User> }>
    ) => {
      const { userId, userData } = action.payload;
      if (state.entities[userId]) {
        state.entities[userId] = { ...state.entities[userId], ...userData };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.ui.isLoading = true;
        state.ui.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.ui.isLoading = false;
        action.payload.forEach((user) => {
          state.entities[user.id] = user;
        });
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.ui.isLoading = false;
        state.ui.error = action.payload as string;
      })
      // Create user
      .addCase(createUser.pending, (state) => {
        state.ui.isLoading = true;
        state.ui.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.ui.isLoading = false;
        state.entities[action.payload.id] = action.payload;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.ui.isLoading = false;
        state.ui.error = action.payload as string;
      })
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.ui.isLoading = true;
        state.ui.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.ui.isLoading = false;
        state.entities[action.payload.id] = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.ui.isLoading = false;
        state.ui.error = action.payload as string;
      })
      // Update user status
      .addCase(updateUserStatus.pending, (state) => {
        state.ui.isLoading = true;
        state.ui.error = null;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.ui.isLoading = false;
        state.entities[action.payload.id] = {
          ...state.entities[action.payload.id],
          status: action.payload.status,
        };
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.ui.isLoading = false;
        state.ui.error = action.payload as string;
      })
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.ui.isLoading = true;
        state.ui.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.ui.isLoading = false;
        delete state.entities[action.payload];
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.ui.isLoading = false;
        state.ui.error = action.payload as string;
      })
      // Update user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.ui.isLoading = true;
        state.ui.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.ui.isLoading = false;
        state.entities[action.payload.id] = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.ui.isLoading = false;
        state.ui.error = action.payload as string;
      });
  },
});

export const { clearError, updateUserLocally } = userSlice.actions;
export default userSlice.reducer;
