// redux/slices/job-slice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/api";

// Define types
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  status?: string;
  createdAt: string;
}

interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  status: string;
  recruiterId: string;
  recruiterName?: string;
  applicationCount?: number;
  createdAt: string;
}

interface Application {
  id: string;
  status: string;
  userId: string;
  jobId: string;
  createdAt: string;
}

interface JobState {
  jobs: Job[];
  users: User[];
  applications: Application[];
  isLoading: boolean;
  error: string | null;
}

const initialState: JobState = {
  jobs: [],
  users: [],
  applications: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/jobs");
      return response.data.jobs;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch jobs"
      );
    }
  }
);

export const fetchUsers = createAsyncThunk(
  "jobs/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/users");
      return response.data.users;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch users"
      );
    }
  }
);

export const fetchApplications = createAsyncThunk(
  "jobs/fetchApplications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/applications");
      return response.data.applications;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch applications"
      );
    }
  }
);

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch jobs
      .addCase(fetchJobs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch applications
      .addCase(fetchApplications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications = action.payload;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = jobSlice.actions;
export default jobSlice.reducer;
