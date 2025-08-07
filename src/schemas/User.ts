import { Schema, model, models, Document, ObjectId } from "mongoose";

// User profile interface
interface IUserProfile {
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

// Full user interface
export interface IUser extends Document {
  email: string;
  password?: string; // Optional because NextAuth handles passwords differently
  name: string;
  image?: string;
  role: "user" | "recruiter" | "admin";
  status: "active" | "inactive" | "pending";
  profile: IUserProfile;
  createdAt: Date;
  updatedAt: Date;
  // NextAuth fields
  emailVerified?: Date;
}

// User profile sub-schema
const UserProfileSchema = new Schema<IUserProfile>({
  phone: { type: String },
  bio: { type: String },
  location: { type: String },
  website: { type: String },
  skills: [{ type: String }],
  experience: { type: String },
  education: { type: String },
  socialLinks: {
    linkedin: { type: String },
    twitter: { type: String },
    github: { type: String },
  },
});

// Main user schema
const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      select: false, // Don't return password by default
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "recruiter", "admin"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "pending"],
      default: "active",
    },
    profile: {
      type: UserProfileSchema,
      default: {},
    },
    // NextAuth fields
    emailVerified: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  }
);

// Indexes for performance
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ status: 1 });

// Force recompilation of model in development
if (models.User) {
  delete models.User;
}

const User = model<IUser>("User", UserSchema);
export default User;
