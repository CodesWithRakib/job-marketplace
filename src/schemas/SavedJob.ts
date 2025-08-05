// schemas/SavedJob.ts
import { Schema, model, models } from "mongoose";

const SavedJobSchema = new Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

const SavedJob = models.SavedJob || model("SavedJob", SavedJobSchema);

export default SavedJob;
