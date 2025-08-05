// redux/slices/job-slice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/api";

// Define types
interface RecruiterJob {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  type: string;
  salary: string;
  status: string;
  applicationCount: number;
  createdAt: string;
}

interface RecruiterApplication {
  id: string;
  status: string;
  userId: string;
  jobId: string;
  coverLetter: string;
  createdAt: string;
  userName: string;
  userEmail: string;
  userImage?: string;
  jobTitle: string;
  jobCompany: string;
}

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

interface UserJob {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  type: string;
  salary: string;
  status: string;
  applicationCount: number;
  createdAt: string;
}

interface UserApplication {
  id: string;
  status: string;
  userId: string;
  jobId: string;
  coverLetter: string;
  createdAt: string;
  jobTitle: string;
  jobCompany: string;
  jobLocation: string;
  jobType: string;
  jobSalary: string;
  recruiterId: string;
}

interface SavedJobItem {
  id: string;
  userId: string;
  jobId: string;
  createdAt: string;
  savedAt: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
}

interface JobState {
  jobs: Job[];
  users: User[];
  applications: Application[];
  isLoading: boolean;
  error: string | null;
  recruiterJobs: RecruiterJob[];
  recruiterApplications: RecruiterApplication[];
  userJobs: UserJob[];
  userApplications: UserApplication[];
  savedJobs: SavedJobItem[];
  currentJob: any;
}

const initialState: JobState = {
  jobs: [],
  users: [],
  applications: [],
  isLoading: false,
  error: null,
  recruiterJobs: [],
  recruiterApplications: [],
  userJobs: [],
  userApplications: [],
  savedJobs: [],
  currentJob: null,
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

export const fetchRecruiterJobs = createAsyncThunk(
  "jobs/fetchRecruiterJobs",
  async (recruiterId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/recruiter/jobs?recruiterId=${recruiterId}`
      );
      return response.data.jobs;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch jobs"
      );
    }
  }
);

export const fetchRecruiterApplications = createAsyncThunk(
  "jobs/fetchRecruiterApplications",
  async (recruiterId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/recruiter/applications?recruiterId=${recruiterId}`
      );
      return response.data.applications;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch applications"
      );
    }
  }
);

// Add these thunks to your existing job slice
export const fetchUserJobs = createAsyncThunk(
  "jobs/fetchUserJobs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/user/jobs");
      return response.data.jobs;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch jobs"
      );
    }
  }
);

export const fetchUserApplications = createAsyncThunk(
  "jobs/fetchUserApplications",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/user/applications?userId=${userId}`);
      return response.data.applications;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch applications"
      );
    }
  }
);

export const fetchSavedJobs = createAsyncThunk(
  "jobs/fetchSavedJobs",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/user/saved-jobs?userId=${userId}`);
      return response.data.savedJobs;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch saved jobs"
      );
    }
  }
);

export const saveJob = createAsyncThunk(
  "jobs/saveJob",
  async (
    { userId, jobId }: { userId: string; jobId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/user/saved-jobs", { userId, jobId });
      return response.data.savedJob;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to save job"
      );
    }
  }
);

export const unsaveJob = createAsyncThunk(
  "jobs/unsaveJob",
  async (
    { userId, jobId }: { userId: string; jobId: string },
    { rejectWithValue }
  ) => {
    try {
      // First, find the saved job ID
      const savedJobsResponse = await api.get(
        `/user/saved-jobs?userId=${userId}`
      );
      const savedJob = savedJobsResponse.data.savedJobs.find(
        (job: any) => job.jobId === jobId
      );

      if (!savedJob) {
        return rejectWithValue("Saved job not found");
      }

      await api.delete(`/user/saved-jobs/${savedJob.id}`);
      return jobId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to unsave job"
      );
    }
  }
);

export const fetchJobById = createAsyncThunk(
  "jobs/fetchJobById",
  async (jobId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/jobs/${jobId}`);
      return response.data.job;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch job"
      );
    }
  }
);

export const applyToJob = createAsyncThunk(
  "jobs/applyToJob",
  async (
    {
      userId,
      jobId,
      coverLetter,
    }: { userId: string; jobId: string; coverLetter?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/user/applications", {
        userId,
        jobId,
        coverLetter,
      });
      return response.data.application;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to apply to job"
      );
    }
  }
);

export const createJob = createAsyncThunk(
  "jobs/createJob",
  async (jobData: any, { rejectWithValue }) => {
    try {
      const response = await api.post("/recruiter/jobs", jobData);
      return response.data.job;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to create job"
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
      })
      // Fetch recruiter jobs
      .addCase(fetchRecruiterJobs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRecruiterJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recruiterJobs = action.payload;
      })
      .addCase(fetchRecruiterJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch recruiter applications
      .addCase(fetchRecruiterApplications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRecruiterApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recruiterApplications = action.payload;
      })
      .addCase(fetchRecruiterApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create job
      .addCase(createJob.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recruiterJobs.unshift(action.payload);
      })
      .addCase(createJob.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete job
      .addCase(deleteJob.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.isLoading = false;
        // Remove the deleted job from the state
        state.recruiterJobs = state.recruiterJobs.filter(
          (job) => job.id !== action.payload
        );
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserJobs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userJobs = action.payload;
      })
      .addCase(fetchUserJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserApplications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userApplications = action.payload;
      })
      .addCase(fetchUserApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
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
        state.error = action.payload as string;
      })
      .addCase(saveJob.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveJob.fulfilled, (state, action) => {
        state.isLoading = false;
        state.savedJobs.unshift(action.payload);
      })
      .addCase(saveJob.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(unsaveJob.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(unsaveJob.fulfilled, (state, action) => {
        state.isLoading = false;
        // Remove the unsaved job from the state
        state.savedJobs = state.savedJobs.filter(
          (job) => job.jobId !== action.payload
        );
      })
      .addCase(unsaveJob.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(applyToJob.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(applyToJob.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userApplications.unshift(action.payload);
      })
      .addCase(applyToJob.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchJobById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentJob = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = jobSlice.actions;
export default jobSlice.reducer;
