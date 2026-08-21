import mongoose, { Document, Model, Schema } from "mongoose";

export interface IList extends Document {
  listName: string;
  group: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const listSchema = new Schema<IList>({
  listName: {
    type: String,
    required: [true, "List name is required"],
    lowercase: true,
    trim: true,
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group"
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, {timestamps: true});

export const List: Model<IList> = mongoose.models.List || mongoose.model<IList>("List", listSchema)
