import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";
import { AdminAnalytics, RecruiterAnalytics } from "@/shared/interfaces";

interface AnalyticsState {
  admin: AdminAnalytics | null;
  recruiter: RecruiterAnalytics | null;
  ui: {
    isLoading: boolean;
    error: string | null;
  };
}

const initialState: AnalyticsState = {
  admin: null,
  recruiter: null,
  ui: {
    isLoading: false,
    error: null,
  },
};

// Thunks
export const fetchAdminAnalytics = createAsyncThunk(
  "analytics/fetchAdminAnalytics",
  async (timeRange: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/analytics?timeRange=${timeRange}`);
      return response.data as AdminAnalytics;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch admin analytics"
      );
    }
  }
);

export const fetchRecruiterAnalytics = createAsyncThunk(
  "analytics/fetchRecruiterAnalytics",
  async (
    { recruiterId, timeRange }: { recruiterId: string; timeRange: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get(
        `/recruiter/analytics?recruiterId=${recruiterId}&timeRange=${timeRange}`
      );
      return response.data as RecruiterAnalytics;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch recruiter analytics"
      );
    }
  }
);

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    clearError: (state) => {
      state.ui.error = null;
    },
    clearAnalytics: (state) => {
      state.admin = null;
      state.recruiter = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch admin analytics
      .addCase(fetchAdminAnalytics.pending, (state) => {
        state.ui.isLoading = true;
        state.ui.error = null;
      })
      .addCase(fetchAdminAnalytics.fulfilled, (state, action) => {
        state.ui.isLoading = false;
        state.admin = action.payload;
      })
      .addCase(fetchAdminAnalytics.rejected, (state, action) => {
        state.ui.isLoading = false;
        state.ui.error = action.payload as string;
      })
      // Fetch recruiter analytics
      .addCase(fetchRecruiterAnalytics.pending, (state) => {
        state.ui.isLoading = true;
        state.ui.error = null;
      })
      .addCase(fetchRecruiterAnalytics.fulfilled, (state, action) => {
        state.ui.isLoading = false;
        state.recruiter = action.payload;
      })
      .addCase(fetchRecruiterAnalytics.rejected, (state, action) => {
        state.ui.isLoading = false;
        state.ui.error = action.payload as string;
      });
  },
});

export const { clearError, clearAnalytics } = analyticsSlice.actions;
export default analyticsSlice.reducer;
