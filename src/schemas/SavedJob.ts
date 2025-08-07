import { Schema, model, models, Document, ObjectId } from "mongoose";

// SavedJob document interface
export interface ISavedJob extends Document {
  userId: ObjectId;
  jobId: ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SavedJobSchema = new Schema<ISavedJob>(
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
    notes: {
      type: String,
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
SavedJobSchema.index({ userId: 1, jobId: 1 }, { unique: true });
SavedJobSchema.index({ userId: 1 });

// Force recompilation of model in development
if (models.SavedJob) {
  delete models.SavedJob;
}

const SavedJob = model<ISavedJob>("SavedJob", SavedJobSchema);
export default SavedJob;
