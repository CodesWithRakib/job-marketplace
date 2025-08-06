// redux/slices/job-slice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

const initialState: JobState = {
  jobs: [],
  currentJob: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  },
};

// Create async thunk for creating a job (for recruiters and admins)
export const createJob = createAsyncThunk(
  "jobs/createJob",
  async (
    jobData: Omit<Job, "_id" | "applicationCount" | "createdAt" | "updatedAt">,
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post("/api/recruiter/jobs", jobData);
      return response.data.job;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to create job"
      );
    }
  }
);

// Create async thunk for fetching jobs (for all users with different filters)
export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async (
    params: {
      page?: number;
      limit?: number;
      status?: string;
      type?: string;
      location?: string;
      query?: string;
      recruiterId?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      // Build query string
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());
      if (params.status) queryParams.append("status", params.status);
      if (params.type) queryParams.append("type", params.type);
      if (params.location) queryParams.append("location", params.location);
      if (params.query) queryParams.append("query", params.query);
      if (params.recruiterId)
        queryParams.append("recruiterId", params.recruiterId);

      const response = await axios.get(`/api/jobs?${queryParams.toString()}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch jobs"
      );
    }
  }
);

// Create async thunk for fetching a single job
export const fetchJobById = createAsyncThunk(
  "jobs/fetchJobById",
  async (jobId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/jobs/${jobId}`);
      return response.data.job;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch job"
      );
    }
  }
);

// Create async thunk for updating a job (for recruiters and admins)
export const updateJob = createAsyncThunk(
  "jobs/updateJob",
  async (
    { jobId, jobData }: { jobId: string; jobData: Partial<Job> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(`/api/recruiter/jobs/${jobId}`, jobData);
      return response.data.job;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update job"
      );
    }
  }
);

// Create async thunk for deleting a job (for recruiters and admins)
export const deleteJob = createAsyncThunk(
  "jobs/deleteJob",
  async (jobId: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/recruiter/jobs/${jobId}`);
      return jobId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to delete job"
      );
    }
  }
);

// Create async thunk for applying to a job (for users)
export const applyToJob = createAsyncThunk(
  "jobs/applyToJob",
  async (
    { jobId, applicationData }: { jobId: string; applicationData: any },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `/api/jobs/${jobId}/apply`,
        applicationData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to apply to job"
      );
    }
  }
);

// Create the job slice
const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetCurrentJob: (state) => {
      state.currentJob = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create job
      .addCase(createJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state, action: PayloadAction<Job>) => {
        state.loading = false;
        state.jobs.unshift(action.payload); // Add new job to the beginning of the array
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch jobs
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.jobs;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch job by ID
      .addCase(fetchJobById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action: PayloadAction<Job>) => {
        state.loading = false;
        state.currentJob = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update job
      .addCase(updateJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJob.fulfilled, (state, action: PayloadAction<Job>) => {
        state.loading = false;
        const index = state.jobs.findIndex(
          (job) => job._id === action.payload._id
        );
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
        if (state.currentJob && state.currentJob._id === action.payload._id) {
          state.currentJob = action.payload;
        }
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete job
      .addCase(deleteJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJob.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.jobs = state.jobs.filter((job) => job._id !== action.payload);
        if (state.currentJob && state.currentJob._id === action.payload) {
          state.currentJob = null;
        }
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Apply to job
      .addCase(applyToJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyToJob.fulfilled, (state, action) => {
        state.loading = false;
        // Update application count for the job if it exists in the list
        const jobId = action.meta.arg.jobId;
        const index = state.jobs.findIndex((job) => job._id === jobId);
        if (index !== -1) {
          state.jobs[index].applicationCount += 1;
        }
        if (state.currentJob && state.currentJob._id === jobId) {
          state.currentJob.applicationCount += 1;
        }
      })
      .addCase(applyToJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetCurrentJob } = jobSlice.actions;
export default jobSlice.reducer;
