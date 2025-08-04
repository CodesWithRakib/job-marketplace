export interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  salary: string;
  job_type: "full-time" | "part-time" | "contract" | "internship";
  experience_level?: "entry" | "mid" | "senior" | "executive";
  skills?: string[];
  posted_by: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  job_id: string;
  user_id: string;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  cover_letter?: string;
  resume_url?: string;
  applied_at: string;
  updated_at: string;
  job?: Job; // Optional populated job data
}
