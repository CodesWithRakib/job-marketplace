import { Schema, model, models, Document, ObjectId } from "mongoose";

// Message document interface
export interface IMessage extends Document {
  sender: ObjectId;
  content: string;
  chat: ObjectId;
  readBy: ObjectId[];
  isDeleted?: boolean;
  attachments?: {
    url: string;
    public_id: string;
    fileType: "image" | "document" | "other";
  }[];
  applicationId?: ObjectId; // Link to application if message is about an application
  status?: string; // Application status if message is about an application
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      trim: true,
    },
    chat: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    attachments: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
        fileType: {
          type: String,
          enum: ["image", "document", "other"],
          required: true,
        },
      },
    ],
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: "Application",
    },
    status: {
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
MessageSchema.index({ chat: 1, createdAt: -1 });
MessageSchema.index({ sender: 1 });
MessageSchema.index({ applicationId: 1 });

// Force recompilation of model in development
if (models.Message) {
  delete models.Message;
}

const Message = model<IMessage>("Message", MessageSchema);
export default Message;
