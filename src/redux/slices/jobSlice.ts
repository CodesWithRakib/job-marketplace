import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/api";
import { Job, Salary } from "@/shared/interfaces";

interface JobState {
  entities: Record<string, Job>;
  ui: {
    isLoading: boolean;
    error: string | null;
    currentJobId: string | null;
  };
  views: {
    admin: string[];
    recruiter: string[];
    user: string[];
  };
}

const initialState: JobState = {
  entities: {},
  ui: {
    isLoading: false,
    error: null,
    currentJobId: null,
  },
  views: {
    admin: [],
    recruiter: [],
    user: [],
  },
};

// Helper function to format salary
const formatSalary = (salary: Salary): string => {
  const { min, max, currency, period } = salary;
  const currencySymbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    CAD: "C$",
    AUD: "A$",
    INR: "₹",
  };
  const symbol = currencySymbols[currency] || currency;
  if (min === max) {
    return `${symbol}${min.toLocaleString()}/${period}`;
  }
  return `${symbol}${min.toLocaleString()} - ${symbol}${max.toLocaleString()}/${period}`;
};

// Helper function to calculate days until deadline
const calculateDaysUntilDeadline = (deadline: string): number => {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Thunks
export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/jobs");
      return response.data.jobs as Job[];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch jobs"
      );
    }
  }
);

export const fetchRecruiterJobs = createAsyncThunk(
  "jobs/fetchRecruiterJobs",
  async (recruiterId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/recruiter/jobs?recruiterId=${recruiterId}`
      );
      return response.data.jobs as Job[];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch jobs"
      );
    }
  }
);

export const fetchUserJobs = createAsyncThunk(
  "jobs/fetchUserJobs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/user/jobs");
      return response.data.jobs as Job[];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch jobs"
      );
    }
  }
);

export const fetchJobById = createAsyncThunk(
  "jobs/fetchJobById",
  async (jobId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/jobs/${jobId}`);
      return response.data.job as Job;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch job"
      );
    }
  }
);

export const createJob = createAsyncThunk(
  "jobs/createJob",
  async (jobData: Partial<Job>, { rejectWithValue }) => {
    try {
      const response = await api.post("/recruiter/jobs", jobData);
      return response.data.job as Job;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to create job"
      );
    }
  }
);

export const updateJob = createAsyncThunk(
  "jobs/updateJob",
  async (
    { jobId, jobData }: { jobId: string; jobData: Partial<Job> },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(`/recruiter/jobs/${jobId}`, jobData);
      return response.data.job as Job;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update job"
      );
    }
  }
);

export const deleteJob = createAsyncThunk(
  "jobs/deleteJob",
  async (jobId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/recruiter/jobs/${jobId}`);
      return jobId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to delete job"
      );
    }
  }
);

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    clearError: (state) => {
      state.ui.error = null;
    },
    clearCurrentJob: (state) => {
      state.ui.currentJobId = null;
    },
    incrementJobView: (state, action: PayloadAction<string>) => {
      const jobId = action.payload;
      if (state.entities[jobId]) {
        state.entities[jobId].views += 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch jobs
      .addCase(fetchJobs.pending, (state) => {
        state.ui.isLoading = true;
        state.ui.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.ui.isLoading = false;
        action.payload.forEach((job) => {
          // Add virtual fields
          job.formattedSalary = formatSalary(job.salary);
          job.daysUntilDeadline = calculateDaysUntilDeadline(
            job.applicationDeadline
          );
          state.entities[job.id] = job;
        });
        state.views.admin = action.payload.map((job) => job.id);
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.ui.isLoading = false;
        state.ui.error = action.payload as string;
      })
      // Fetch recruiter jobs
      .addCase(fetchRecruiterJobs.pending, (state) => {
        state.ui.isLoading = true;
        state.ui.error = null;
      })
      .addCase(fetchRecruiterJobs.fulfilled, (state, action) => {
        state.ui.isLoading = false;
        action.payload.forEach((job) => {
          // Add virtual fields
          job.formattedSalary = formatSalary(job.salary);
          job.daysUntilDeadline = calculateDaysUntilDeadline(
            job.applicationDeadline
          );
          state.entities[job.id] = job;
        });
        state.views.recruiter = action.payload.map((job) => job.id);
      })
      .addCase(fetchRecruiterJobs.rejected, (state, action) => {
        state.ui.isLoading = false;
        state.ui.error = action.payload as string;
      })
      // Fetch user jobs
      .addCase(fetchUserJobs.pending, (state) => {
        state.ui.isLoading = true;
        state.ui.error = null;
      })
      .addCase(fetchUserJobs.fulfilled, (state, action) => {
        state.ui.isLoading = false;
        action.payload.forEach((job) => {
          // Add virtual fields
          job.formattedSalary = formatSalary(job.salary);
          job.daysUntilDeadline = calculateDaysUntilDeadline(
            job.applicationDeadline
          );
          state.entities[job.id] = job;
        });
        state.views.user = action.payload.map((job) => job.id);
      })
      .addCase(fetchUserJobs.rejected, (state, action) => {
        state.ui.isLoading = false;
        state.ui.error = action.payload as string;
      })
      // Fetch job by ID
      .addCase(fetchJobById.pending, (state) => {
        state.ui.isLoading = true;
        state.ui.error = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.ui.isLoading = false;
        const job = action.payload;
        // Add virtual fields
        job.formattedSalary = formatSalary(job.salary);
        job.daysUntilDeadline = calculateDaysUntilDeadline(
          job.applicationDeadline
        );
        state.entities[job.id] = job;
        state.ui.currentJobId = job.id;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.ui.isLoading = false;
        state.ui.error = action.payload as string;
      })
      // Create job
      .addCase(createJob.pending, (state) => {
        state.ui.isLoading = true;
        state.ui.error = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.ui.isLoading = false;
        const job = action.payload;
        // Add virtual fields
        job.formattedSalary = formatSalary(job.salary);
        job.daysUntilDeadline = calculateDaysUntilDeadline(
          job.applicationDeadline
        );
        state.entities[job.id] = job;
        state.views.recruiter.unshift(job.id);
      })
      .addCase(createJob.rejected, (state, action) => {
        state.ui.isLoading = false;
        state.ui.error = action.payload as string;
      })
      // Update job
      .addCase(updateJob.pending, (state) => {
        state.ui.isLoading = true;
        state.ui.error = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.ui.isLoading = false;
        const job = action.payload;
        // Add virtual fields
        job.formattedSalary = formatSalary(job.salary);
        job.daysUntilDeadline = calculateDaysUntilDeadline(
          job.applicationDeadline
        );
        state.entities[job.id] = job;
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.ui.isLoading = false;
        state.ui.error = action.payload as string;
      })
      // Delete job
      .addCase(deleteJob.pending, (state) => {
        state.ui.isLoading = true;
        state.ui.error = null;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.ui.isLoading = false;
        const jobId = action.payload;
        delete state.entities[jobId];
        state.views.recruiter = state.views.recruiter.filter(
          (id) => id !== jobId
        );
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.ui.isLoading = false;
        state.ui.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentJob, incrementJobView } =
  jobSlice.actions;
export default jobSlice.reducer;
