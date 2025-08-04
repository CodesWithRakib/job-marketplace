import api from "@/lib/api";
import { Job, Application } from "@/types/job";

export const jobService = {
  // Get all jobs with optional filters
  async getJobs(filters?: {
    search?: string;
    location?: string;
    type?: string;
  }): Promise<Job[]> {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.location) params.append("location", filters.location);
    if (filters?.type) params.append("type", filters.type);

    const response = await api.get<Job[]>(`/jobs?${params.toString()}`);
    return response.data;
  },

  // Get a specific job by ID
  async getJobById(id: string): Promise<Job> {
    const response = await api.get<Job>(`/jobs/${id}`);
    return response.data;
  },

  // Create a new job
  async createJob(
    job: Omit<Job, "id" | "created_at" | "updated_at">
  ): Promise<Job> {
    const response = await api.post<Job>("/jobs", job);
    return response.data;
  },

  // Update a job
  async updateJob(id: string, updates: Partial<Job>): Promise<Job> {
    const response = await api.put<Job>(`/jobs/${id}`, updates);
    return response.data;
  },

  // Delete a job
  async deleteJob(id: string): Promise<void> {
    await api.delete(`/jobs/${id}`);
  },

  // Apply to a job
  async applyToJob(jobId: string, coverLetter?: string): Promise<Application> {
    const response = await api.post<Application>(`/jobs/${jobId}/apply`, {
      coverLetter,
    });
    return response.data;
  },

  // Get user's applications
  async getUserApplications(): Promise<Application[]> {
    const response = await api.get<Application[]>("/applications");
    return response.data;
  },

  // Get applications for a specific job
  async getJobApplications(jobId: string): Promise<Application[]> {
    const response = await api.get<Application[]>(
      `/jobs/${jobId}/applications`
    );
    return response.data;
  },

  // Update application status
  async updateApplicationStatus(
    applicationId: string,
    status: "pending" | "reviewed" | "accepted" | "rejected"
  ): Promise<Application> {
    const response = await api.put<Application>(
      `/applications/${applicationId}`,
      {
        status,
      }
    );
    return response.data;
  },

  // Save a job
  async saveJob(jobId: string): Promise<void> {
    await api.post("/saved-jobs", { jobId });
  },

  // Unsave a job
  async unsaveJob(jobId: string): Promise<void> {
    await api.delete(`/saved-jobs/${jobId}`);
  },

  // Get saved jobs
  async getSavedJobs(): Promise<Job[]> {
    const response = await api.get<Job[]>("/saved-jobs");
    return response.data;
  },
};
