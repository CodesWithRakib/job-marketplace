import mongoose, { Document, Schema } from "mongoose";

// Define the interface for the User document
interface IUser extends Document {
  email: string;
  password: string;
  role: "admin" | "recruiter" | "user";
  full_name: string;
  avatar_url?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema with proper typing
const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "recruiter", "user"],
      default: "user",
    },
    full_name: {
      type: String,
      required: true,
      trim: true,
    },
    avatar_url: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // This automatically adds createdAt and updatedAt fields
  }
);

// Create and export the model
const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
