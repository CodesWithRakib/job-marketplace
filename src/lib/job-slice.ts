import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/api";
import { Job, Application } from "@/types/job";

interface JobState {
  jobs: Job[];
  applications: Application[];
  savedJobs: Job[];
  isLoading: boolean;
  error: string | null;
}

const initialState: JobState = {
  jobs: [],
  applications: [],
  savedJobs: [],
  isLoading: false,
  error: null,
};

// Fetch all jobs with optional filters
export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async (filters?: { search?: string; location?: string; type?: string }) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.location) params.append("location", filters.location);
    if (filters?.type) params.append("type", filters.type);

    const response = await api.get(`/jobs?${params.toString()}`);
    return response.data;
  }
);

// Fetch a specific job by ID
export const fetchJobById = createAsyncThunk(
  "jobs/fetchJobById",
  async (jobId: string) => {
    const response = await api.get(`/jobs/${jobId}`);
    return response.data;
  }
);

// Create a new job
export const createJob = createAsyncThunk(
  "jobs/createJob",
  async (jobData: Omit<Job, "id" | "created_at" | "updated_at">) => {
    const response = await api.post("/jobs", jobData);
    return response.data;
  }
);

// Update a job
export const updateJob = createAsyncThunk(
  "jobs/updateJob",
  async ({ id, updates }: { id: string; updates: Partial<Job> }) => {
    const response = await api.put(`/jobs/${id}`, updates);
    return response.data;
  }
);

// Delete a job
export const deleteJob = createAsyncThunk(
  "jobs/deleteJob",
  async (jobId: string) => {
    await api.delete(`/jobs/${jobId}`);
    return jobId;
  }
);

// Apply to a job
export const applyToJob = createAsyncThunk(
  "jobs/applyToJob",
  async ({ jobId, coverLetter }: { jobId: string; coverLetter?: string }) => {
    const response = await api.post(`/jobs/${jobId}/apply`, { coverLetter });
    return response.data;
  }
);

// Fetch user's applications
export const fetchUserApplications = createAsyncThunk(
  "jobs/fetchUserApplications",
  async () => {
    const response = await api.get("/applications");
    return response.data;
  }
);

// Fetch applications for a specific job (for recruiters)
export const fetchJobApplications = createAsyncThunk(
  "jobs/fetchJobApplications",
  async (jobId: string) => {
    const response = await api.get(`/jobs/${jobId}/applications`);
    return response.data;
  }
);

// Update application status
export const updateApplicationStatus = createAsyncThunk(
  "jobs/updateApplicationStatus",
  async ({
    applicationId,
    status,
  }: {
    applicationId: string;
    status: string;
  }) => {
    const response = await api.put(`/applications/${applicationId}`, {
      status,
    });
    return response.data;
  }
);

// Save a job
export const saveJob = createAsyncThunk(
  "jobs/saveJob",
  async (jobId: string) => {
    const response = await api.post("/saved-jobs", { jobId });
    return response.data;
  }
);

// Unsave a job
export const unsaveJob = createAsyncThunk(
  "jobs/unsaveJob",
  async (jobId: string) => {
    await api.delete(`/saved-jobs/${jobId}`);
    return jobId;
  }
);

// Fetch saved jobs
export const fetchSavedJobs = createAsyncThunk(
  "jobs/fetchSavedJobs",
  async () => {
    const response = await api.get("/saved-jobs");
    return response.data;
  }
);

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    clearJobError: (state) => {
      state.error = null;
    },
    clearJobs: (state) => {
      state.jobs = [];
      state.applications = [];
      state.savedJobs = [];
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
        state.error = action.error.message || "Failed to fetch jobs";
      })

      // Fetch job by ID
      .addCase(fetchJobById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update the job in the jobs array if it exists
        const index = state.jobs.findIndex(
          (job) => job.id === action.payload.id
        );
        if (index !== -1) {
          state.jobs[index] = action.payload;
        } else {
          state.jobs.unshift(action.payload);
        }
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch job";
      })

      // Create job
      .addCase(createJob.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobs.unshift(action.payload);
      })
      .addCase(createJob.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to create job";
      })

      // Update job
      .addCase(updateJob.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.jobs.findIndex(
          (job) => job.id === action.payload.id
        );
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to update job";
      })

      // Delete job
      .addCase(deleteJob.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobs = state.jobs.filter((job) => job.id !== action.payload);
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to delete job";
      })

      // Apply to job
      .addCase(applyToJob.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(applyToJob.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications.unshift(action.payload);
      })
      .addCase(applyToJob.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to apply to job";
      })

      // Fetch user applications
      .addCase(fetchUserApplications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications = action.payload;
      })
      .addCase(fetchUserApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch applications";
      })

      // Update application status
      .addCase(updateApplicationStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.applications.findIndex(
          (app) => app.id === action.payload.id
        );
        if (index !== -1) {
          state.applications[index] = action.payload;
        }
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || "Failed to update application status";
      })

      // Save job
      .addCase(saveJob.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveJob.fulfilled, (state, action) => {
        state.isLoading = false;
        const job = state.jobs.find((job) => job.id === action.payload.jobId);
        if (job) {
          state.savedJobs.push(job);
        }
      })
      .addCase(saveJob.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to save job";
      })

      // Unsave job
      .addCase(unsaveJob.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(unsaveJob.fulfilled, (state, action) => {
        state.isLoading = false;
        state.savedJobs = state.savedJobs.filter(
          (job) => job.id !== action.payload
        );
      })
      .addCase(unsaveJob.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to unsave job";
      })

      // Fetch saved jobs
      .addCase(fetchSavedJobs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSavedJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.savedJobs = action.payload;
      })
      .addCase(fetchSavedJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch saved jobs";
      });
  },
});

export const { clearJobError, clearJobs } = jobSlice.actions;
export default jobSlice.reducer;
