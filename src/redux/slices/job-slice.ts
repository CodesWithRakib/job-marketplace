// redux/slices/job-slice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/api";
import { IJob } from "@/schemas/Job";

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
  profileImage?: string;
  phone?: string;
  bio?: string;
  location?: string;
  website?: string;
}

// Define the Job type
interface Job {
  _id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  type: "full-time" | "part-time" | "contract" | "internship" | "remote";
  salary: string;
  status: "active" | "inactive";
  applicationDeadline?: string;
  experience?: string;
  skills: string[];
  recruiterId: string;
  applicationCount: number;
  createdAt: string;
  updatedAt: string;
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

// Analytics interfaces
interface AdminAnalytics {
  users: {
    total: number;
    new: number;
    growth: Array<{ _id: string; count: number }>;
  };
  jobs: {
    total: number;
    new: number;
    growth: Array<{ _id: string; count: number }>;
  };
  applications: {
    total: number;
    new: number;
    growth: Array<{ _id: string; count: number }>;
  };
  roleDistribution: Array<{ _id: string; count: number }>;
  jobTypeDistribution: Array<{ _id: string; count: number }>;
  applicationStatusDistribution: Array<{ _id: string; count: number }>;
}

interface RecruiterAnalytics {
  jobs: {
    total: number;
    active: number;
    growth: Array<{ _id: string; count: number }>;
  };
  applications: {
    total: number;
    new: number;
    growth: Array<{ _id: string; count: number }>;
  };
  applicationStatusDistribution: Array<{ _id: string; count: number }>;
  topJobs: Array<{
    id: string;
    title: string;
    applicationCount: number;
    viewCount: number;
  }>;
}

interface JobState {
  jobs: IJob[];
  users: User[];
  applications: Application[];
  isLoading: boolean;
  error: string | null;
  recruiterJobs: RecruiterJob[];
  recruiterApplications: RecruiterApplication[];
  userJobs: UserJob[];
  userApplications: UserApplication[];
  savedJobs: SavedJobItem[];
  currentJob: IJob | null;
  analytics: AdminAnalytics | null;
  recruiterAnalytics: RecruiterAnalytics | null;
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
  analytics: null,
  recruiterAnalytics: null,
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
  async (jobData: Partial<IJob>, { rejectWithValue }) => {
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

// Admin Analytics
export const fetchAdminAnalytics = createAsyncThunk(
  "jobs/fetchAdminAnalytics",
  async (timeRange: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/analytics?timeRange=${timeRange}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch admin analytics"
      );
    }
  }
);

// Recruiter Analytics
export const fetchRecruiterAnalytics = createAsyncThunk(
  "jobs/fetchRecruiterAnalytics",
  async (
    { recruiterId, timeRange }: { recruiterId: string; timeRange: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get(
        `/recruiter/analytics?recruiterId=${recruiterId}&timeRange=${timeRange}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch recruiter analytics"
      );
    }
  }
);

// User management thunks
export const createUser = createAsyncThunk(
  "jobs/createUser",
  async (userData: any, { rejectWithValue }) => {
    try {
      const response = await api.post("/admin/users", userData);
      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to create user"
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  "jobs/updateUser",
  async (
    { userId, userData }: { userId: string; userData: any },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(`/admin/users/${userId}`, userData);
      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update user"
      );
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  "jobs/updateUserStatus",
  async (
    { userId, status }: { userId: string; status: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.patch(`/admin/users/${userId}/status`, {
        status,
      });
      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update user status"
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  "jobs/deleteUser",
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
  "jobs/updateUserProfile",
  async (
    { userId, profileData }: { userId: string; profileData: any },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(`/user/profile/${userId}`, profileData);
      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update user profile"
      );
    }
  }
);

export const changeUserPassword = createAsyncThunk(
  "jobs/changeUserPassword",
  async (
    {
      userId,
      currentPassword,
      newPassword,
    }: { userId: string; currentPassword: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(`/user/change-password/${userId}`, {
        currentPassword,
        newPassword,
      });
      return response.data.message;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to change password"
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
    clearCurrentJob: (state) => {
      state.currentJob = null;
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
      })
      // Admin Analytics
      .addCase(fetchAdminAnalytics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.analytics = action.payload;
      })
      .addCase(fetchAdminAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Recruiter Analytics
      .addCase(fetchRecruiterAnalytics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRecruiterAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recruiterAnalytics = action.payload;
      })
      .addCase(fetchRecruiterAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // User management
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users.unshift(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update the user in the state
        state.users = state.users.map((user) =>
          user.id === action.payload.id ? action.payload : user
        );
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update the user status in the state
        state.users = state.users.map((user) =>
          user.id === action.payload.id
            ? { ...user, status: action.payload.status }
            : user
        );
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        // Remove the deleted user from the state
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update the user profile in the state
        state.users = state.users.map((user) =>
          user.id === action.payload.id ? action.payload : user
        );
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
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
      });
  },
});

export const { clearError, clearCurrentJob } = jobSlice.actions;
export default jobSlice.reducer;
