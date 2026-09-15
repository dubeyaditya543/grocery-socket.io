import mongoose, { Schema, Document, Model } from "mongoose";

interface INotification extends Document {
  message: string;
  sentTo: mongoose.Types.ObjectId;
  sentBy: mongoose.Types.ObjectId;
  groupId: mongoose.Types.ObjectId;
  link?: string;
}

const notificationSchema = new Schema<INotification>(
  {
    message: {
      type: String,
      required: [true, "Message is required to send a message"],
      lowercase: true,
      trim: true,
    },
    sentTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
    link: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

export const Notification: Model<INotification> =
  mongoose.models.Notification || mongoose.model<INotification>("Notification", notificationSchema);
