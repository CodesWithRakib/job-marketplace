// schemas/Application.ts
import { Schema, model, models } from "mongoose";

const ApplicationSchema = new Schema(
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
  },
  {
    timestamps: true,
  }
);

const Application =
  models.Application || model("Application", ApplicationSchema);

export default Application;
