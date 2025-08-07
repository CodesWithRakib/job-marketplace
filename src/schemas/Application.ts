import { Schema, model, models, Document, ObjectId } from "mongoose";

// Application document interface
export interface IApplication extends Document {
  status: "pending" | "reviewed" | "accepted" | "rejected";
  userId: ObjectId;
  jobId: ObjectId;
  coverLetter: string;
  resumeUrl?: string;
  notes?: string;
  interviewDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    status: {
      type: String,
      enum: ["pending", "reviewed", "accepted", "rejected"],
      default: "pending",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    coverLetter: {
      type: String,
      default: "",
    },
    resumeUrl: {
      type: String,
    },
    notes: {
      type: String,
    },
    interviewDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes for performance
ApplicationSchema.index({ userId: 1, jobId: 1 });
ApplicationSchema.index({ status: 1 });
ApplicationSchema.index({ jobId: 1, status: 1 });

// Force recompilation of model in development
if (models.Application) {
  delete models.Application;
}

const Application = model<IApplication>("Application", ApplicationSchema);
export default Application;
