import { Schema, model, models, Document, ObjectId } from "mongoose";

// Chat document interface
export interface IChat extends Document {
  participants: ObjectId[];
  isGroupChat: boolean;
  chatName?: string;
  lastMessage?: ObjectId;
  admin?: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema = new Schema<IChat>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    chatName: {
      type: String,
      trim: true,
    },
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
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
ChatSchema.index({ participants: 1 });
ChatSchema.index({ lastMessage: 1 });

// Force recompilation of model in development
if (models.Chat) {
  delete models.Chat;
}

const Chat = model<IChat>("Chat", ChatSchema);
export default Chat;
