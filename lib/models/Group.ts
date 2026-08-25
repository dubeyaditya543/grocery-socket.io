import mongoose, { Document, Model, Schema } from "mongoose";
import { nanoid } from "nanoid";
import "@/lib/models/User"

export interface IGroup extends Document {
  groupName: string;
  members: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  joinCode: string;
  createdAt: Date;
  updatedAt: Date;
}

const groupSchema = new Schema<IGroup>(
  {
    groupName: {
      type: String,
      required: [true, "Group name is required"],
      trim: true,
      lowercase: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    joinCode: {
      type: String,
      unique: true
    }
  },
  { timestamps: true },
);

groupSchema.pre("save", function(){
  if(!this.joinCode){
    this.joinCode = nanoid(8)
  }
})

export const Group: Model<IGroup> =
  mongoose.models.Group || mongoose.model<IGroup>("Group", groupSchema);
