import mongoose, { Document, Model, Schema } from "mongoose";
import { hashPassword } from "../password";

export interface IUser extends Document {
  fullName: string;
  username: string;
  email: string;
  password: string;
  avatarUrl: string;
  avatarPublicId: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      minLength: [3, "Full name must be at least 3 chars"],
      maxLength: [25, "Full name can have at max 25 chars"],
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Must provide a username"],
      minLength: [3, "Username must be at least 3 chars long"],
      maxLength: [20, "Username can be at max 20 chars long"],
      unique: [true, "Username must be unique"],
      trim: true,
      match: [
        /^[a-z0-9_]+$/,
        "Username can only contain lowercase letters, numbers, and underscores",
      ],
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      trim: true,
      required: [true, "Email is required"],
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [8, "Password must be at least 8 chars long"],
      select: false,
    },
    avatarUrl: {
      type: String,
      default: "",
    },
    avatarPublicId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  this.password = await hashPassword(this.password);
});

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
