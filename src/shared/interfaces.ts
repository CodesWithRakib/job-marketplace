// Base interfaces
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// User interfaces
export interface BaseUser extends BaseEntity {
  email: string;
  name: string;
  image?: string;
  role: string;
  status: string;
}

export interface UserProfile {
  phone?: string;
  bio?: string;
  location?: string;
  website?: string;
  skills?: string[];
  experience?: string;
  education?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}

export interface User extends BaseUser {
  profile: UserProfile;
  emailVerified?: string;
}

// Job interfaces
export interface Salary {
  min: number;
  max: number;
  currency: "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "INR";
  period: "hourly" | "monthly" | "yearly";
}

export interface Job extends BaseEntity {
  title: string;
  company: string;
  companyLogo?: string;
  companyWebsite?: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  location: string;
  isRemote: boolean;
  type: "full-time" | "part-time" | "contract" | "internship" | "freelance";
  experience: "entry" | "mid" | "senior" | "executive";
  salary: Salary;
  benefits: string[];
  applicationDeadline: string;
  applicationMethod: "email" | "external" | "platform";
  applicationEmail?: string;
  applicationUrl?: string;
  status: "draft" | "active" | "inactive" | "filled" | "closed";
  recruiterId: string;
  applicationCount: number;
  views: number;
  category:
    | "Engineering"
    | "Design"
    | "Marketing"
    | "Sales"
    | "Customer Service"
    | "Operations"
    | "Finance"
    | "HR"
    | "Data"
    | "Product"
    | "Other";
  industry: string;
  tags: string[];
  featured: boolean;
  promotedUntil?: string;
  formattedSalary?: string;
  daysUntilDeadline?: number;
}

// Application interfaces
export interface Application extends BaseEntity {
  status: "pending" | "reviewed" | "accepted" | "rejected";
  userId: string;
  jobId: string;
  coverLetter: string;
  resumeUrl?: string;
  notes?: string;
  interviewDate?: string;
}

// Recruiter Application (with additional fields)
export interface RecruiterApplication extends Application {
  userName: string;
  userEmail: string;
  userImage?: string;
  jobTitle: string;
  jobCompany: string;
}

// User Application (with additional fields)
export interface UserApplication extends Application {
  jobTitle: string;
  jobCompany: string;
  jobLocation: string;
  jobType: string;
  jobSalary: string;
  recruiterId: string;
}

// SavedJob interfaces
export interface SavedJob extends BaseEntity {
  userId: string;
  jobId: string;
  notes?: string;
}

// Chat interfaces
export interface Chat extends BaseEntity {
  participants: string[];
  isGroupChat: boolean;
  chatName?: string;
  lastMessage?: string;
  admin?: string;
}

// Message interfaces
export interface Message extends BaseEntity {
  sender: string;
  content: string;
  chat: string;
  readBy: string[];
  isDeleted?: boolean;
  attachments?: {
    url: string;
    public_id: string;
    fileType: "image" | "document" | "other";
  }[];
  applicationId?: string;
  status?: string;
}

// Analytics interfaces
export interface AdminAnalytics {
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

export interface RecruiterAnalytics {
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

// Real-time chat interfaces
export interface UserOnlineStatus {
  userId: string;
  isOnline: boolean;
  lastSeen?: string;
}

export interface TypingIndicator {
  chatId: string;
  userId: string;
  isTyping: boolean;
}

export interface MessageStatus {
  messageId: string;
  status: "sent" | "delivered" | "read";
  timestamp: string;
}
