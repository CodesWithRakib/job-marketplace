import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/api";
import {
  Application,
  RecruiterApplication,
  UserApplication,
  SavedJob,
} from "@/shared/interfaces";

interface ApplicationState {
  entities: Record<string, Application>;
  savedJobs: Record<string, SavedJob>;
  ui: {
    isLoading: boolean;
    error: string | null;
  };
  views: {
    admin: string[];
    recruiter: string[];
    user: string[];
  };
}

const initialState: ApplicationState = {
  entities: {},
  savedJobs: {},
  ui: {
    isLoading: false,
    error: null,
  },
  views: {
    admin: [],
    recruiter: [],
    user: [],
  },
};

// Thunks
export const fetchApplications = createAsyncThunk(
  "applications/fetchApplications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/applications");
      return response.data.applications as Application[];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch applications"
      );
    }
  }
);

export const fetchRecruiterApplications = createAsyncThunk(
  "applications/fetchRecruiterApplications",
  async (recruiterId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/recruiter/applications?recruiterId=${recruiterId}`
      );
      return response.data.applications as RecruiterApplication[];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch applications"
      );
    }
  }
);

export const fetchUserApplications = createAsyncThunk(
  "applications/fetchUserApplications",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/user/applications?userId=${userId}`);
      return response.data.applications as UserApplication[];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch applications"
      );
    }
  }
);

export const applyToJob = createAsyncThunk(
  "applications/applyToJob",
  async (
    {
      userId,
      jobId,
      coverLetter,
      resumeUrl,
    }: {
      userId: string;
      jobId: string;
      coverLetter?: string;
      resumeUrl?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/user/applications", {
        userId,
        jobId,
        coverLetter,
        resumeUrl,
      });
      return response.data.application as Application;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to apply to job"
      );
    }
  }
);

export const updateApplication = createAsyncThunk(
  "applications/updateApplication",
  async (
    {
      applicationId,
      status,
      notes,
      interviewDate,
    }: {
      applicationId: string;
      status?: string;
      notes?: string;
      interviewDate?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(
        `/recruiter/applications/${applicationId}`,
        {
          status,
          notes,
          interviewDate,
        }
      );
      return response.data.application as Application;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update application"
      );
    }
  }
);

export const fetchSavedJobs = createAsyncThunk(
  "applications/fetchSavedJobs",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/user/saved-jobs?userId=${userId}`);
      return response.data.savedJobs as SavedJob[];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch saved jobs"
      );
    }
  }
);

export const saveJob = createAsyncThunk(
  "applications/saveJob",
  async (
    { userId, jobId, notes }: { userId: string; jobId: string; notes?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/user/saved-jobs", {
        userId,
        jobId,
        notes,
      });
      return response.data.savedJob as SavedJob;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to save job"
      );
    }
  }
);

export const updateSavedJob = createAsyncThunk(
  "applications/updateSavedJob",
  async (
    { savedJobId, notes }: { savedJobId: string; notes: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(`/user/saved-jobs/${savedJobId}`, {
        notes,
      });
      return response.data.savedJob as SavedJob;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update saved job"
      );
    }
  }
);

export const unsaveJob = createAsyncThunk(
  "applications/unsaveJob",
  async (savedJobId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/user/saved-jobs/${savedJobId}`);
      return savedJobId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to unsave job"
      );
    }
  }
);

const applicationSlice = createSlice({
  name: "applications",
  initialState,
  reducers: {
    clearError: (state) => {
      state.ui.error = null;
    },
    addMessageToApplication: (
      state,
      action: PayloadAction<{ applicationId: string; message: string }>
    ) => {
      const { applicationId, message } = action.payload;
      if (state.entities[applicationId]) {
        if (!state.entities[applicationId].notes) {
          state.entities[applicationId].notes = "";
        }
        state.entities[applicationId].notes += `\n${message}`;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch applications
      .addCase(fetchApplications.pending, (state) => {
        state.ui.isLoading = true;
        state.ui.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.ui.isLoading = false;
        action.payload.forEach((app) => {
          state.entities[app.id] = app;
        });
        state.views.admin = action.payload.map((app) => app.id);
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.ui.isLoading = false;
        state.ui.error = action.payload as string;
      })
      // Fetch recruiter applications
      .addCase(fetchRecruiterApplications.pending, (state) => {
        state.ui.isLoading = true;
        state.ui.error = null;
      })
      .addCase(fetchRecruiterApplications.fulfilled, (state, action) => {
        state.ui.isLoading = false;
        action.payload.forEach((app) => {
          state.entities[app.id] = app;
        });
        state.views.recruiter = action.payload.map((app) => app.id);
      })
      .addCase(fetchRecruiterApplications.rejected, (state, action) => {
        state.ui.isLoading = false;
        state.ui.error = action.payload as string;
      })
      // Fetch user applications
      .addCase(fetchUserApplications.pending, (state) => {
        state.ui.isLoading = true;
        state.ui.error = null;
      })
      .addCase(fetchUserApplications.fulfilled, (state, action) => {
        state.ui.isLoading = false;
        action.payload.forEach((app) => {
          state.entities[app.id] = app;
        });
        state.views.user = action.payload.map((app) => app.id);
      })
      .addCase(fetchUserApplications.rejected, (state, action) => {
        state.ui.isLoading = false;
        state.ui.error = action.payload as string;
      })
      // Apply to job
      .addCase(applyToJob.pending, (state) => {
        state.ui.isLoading = true;
        state.ui.error = null;
      })
      .addCase(applyToJob.fulfilled, (state, action) => {
        state.ui.isLoading = false;
        state.entities[action.payload.id] = action.payload;
        state.views.user.unshift(action.payload.id);
      })
      .addCase(applyToJob.rejected, (state, action) => {
        state.ui.isLoading = false;
        state.ui.error = action.payload as string;
      })
      // Update application
      .addCase(updateApplication.pending, (state) => {
        state.ui.isLoading = true;
        state.ui.error = null;
      })
      .addCase(updateApplication.fulfilled, (state, action) => {
        state.ui.isLoading = false;
        state.entities[action.payload.id] = action.payload;
      })
      .addCase(updateApplication.rejected, (state, action) => {
        state.ui.isLoading = false;
        state.ui.error = action.payload as string;
      })
      // Fetch saved jobs
      .addCase(fetchSavedJobs.pending, (state) => {
        state.ui.isLoading = true;
        state.ui.error = null;
      })
      .addCase(fetchSavedJobs.fulfilled, (state, action) => {
        state.ui.isLoading = false;
        action.payload.forEach((job) => {
          state.savedJobs[job.id] = job;
        });
      })
      .addCase(fetchSavedJobs.rejected, (state, action) => {
        state.ui.isLoading = false;
        state.ui.error = action.payload as string;
      })
      // Save job
      .addCase(saveJob.pending, (state) => {
        state.ui.isLoading = true;
        state.ui.error = null;
      })
      .addCase(saveJob.fulfilled, (state, action) => {
        state.ui.isLoading = false;
        state.savedJobs[action.payload.id] = action.payload;
      })
      .addCase(saveJob.rejected, (state, action) => {
        state.ui.isLoading = false;
        state.ui.error = action.payload as string;
      })
      // Update saved job
      .addCase(updateSavedJob.pending, (state) => {
        state.ui.isLoading = true;
        state.ui.error = null;
      })
      .addCase(updateSavedJob.fulfilled, (state, action) => {
        state.ui.isLoading = false;
        state.savedJobs[action.payload.id] = action.payload;
      })
      .addCase(updateSavedJob.rejected, (state, action) => {
        state.ui.isLoading = false;
        state.ui.error = action.payload as string;
      })
      // Unsave job
      .addCase(unsaveJob.pending, (state) => {
        state.ui.isLoading = true;
        state.ui.error = null;
      })
      .addCase(unsaveJob.fulfilled, (state, action) => {
        state.ui.isLoading = false;
        delete state.savedJobs[action.payload];
      })
      .addCase(unsaveJob.rejected, (state, action) => {
        state.ui.isLoading = false;
        state.ui.error = action.payload as string;
      });
  },
});

export const { clearError, addMessageToApplication } = applicationSlice.actions;
export default applicationSlice.reducer;
