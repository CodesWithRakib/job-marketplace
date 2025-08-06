// schemas/Job.ts
import { Schema, model, models, Document, ObjectId } from "mongoose";

// Salary sub-document interface
interface ISalary {
  min: number;
  max: number;
  currency: "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "INR";
  period: "hourly" | "monthly" | "yearly";
}

// Job document interface
export interface IJob extends Document {
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
  salary: ISalary;
  benefits: string[];
  applicationDeadline: Date;
  applicationMethod: "email" | "external" | "platform";
  applicationEmail?: string;
  applicationUrl?: string;
  status: "draft" | "active" | "inactive" | "filled" | "closed";
  recruiterId: ObjectId;
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
  promotedUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
  __v?: number;

  // Virtual properties
  formattedSalary?: string;
  daysUntilDeadline?: number;
}

// Salary sub-schema
const SalarySchema = new Schema<ISalary>({
  min: { type: Number, required: true },
  max: { type: Number, required: true },
  currency: {
    type: String,
    default: "USD",
    enum: ["USD", "EUR", "GBP", "CAD", "AUD", "INR"],
  },
  period: {
    type: String,
    default: "yearly",
    enum: ["hourly", "monthly", "yearly"],
  },
});

// Main job schema
const JobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    companyLogo: {
      type: String,
    },
    companyWebsite: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    responsibilities: [
      {
        type: String,
        required: true,
      },
    ],
    requirements: [
      {
        type: String,
        required: true,
      },
    ],
    location: {
      type: String,
      required: true,
    },
    isRemote: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship", "freelance"],
      required: true,
    },
    experience: {
      type: String,
      enum: ["entry", "mid", "senior", "executive"],
      required: true,
    },
    salary: {
      type: SalarySchema,
      required: true,
    },
    benefits: [
      {
        type: String,
      },
    ],
    applicationDeadline: {
      type: Date,
      required: true,
    },
    applicationMethod: {
      type: String,
      enum: ["email", "external", "platform"],
      default: "platform",
    },
    applicationEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    applicationUrl: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["draft", "active", "inactive", "filled", "closed"],
      default: "draft",
    },
    recruiterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applicationCount: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Engineering",
        "Design",
        "Marketing",
        "Sales",
        "Customer Service",
        "Operations",
        "Finance",
        "HR",
        "Data",
        "Product",
        "Other",
      ],
    },
    industry: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
    promotedUntil: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Virtual for formatted salary
JobSchema.virtual("formattedSalary").get(function () {
  const { min, max, currency, period } = this.salary;
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
});

// Virtual for days until deadline
JobSchema.virtual("daysUntilDeadline").get(function () {
  const now = new Date();
  const deadline = new Date(this.applicationDeadline);
  const diffTime = deadline.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Indexes for performance
JobSchema.index({ title: "text", description: "text", tags: "text" });
JobSchema.index({ status: 1, recruiterId: 1 });
JobSchema.index({ applicationDeadline: 1 });
JobSchema.index({ category: 1, industry: 1 });

// Force recompilation of model in development
if (models.Job) {
  delete models.Job;
}
const Job = model<IJob>("Job", JobSchema);
export default Job;
