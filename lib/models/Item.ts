import mongoose, { Document, Model, Schema } from "mongoose";

export interface IItem extends Document {
  itemName: string,
  purchased: boolean,
  addedBy: mongoose.Types.ObjectId,
  list: mongoose.Types.ObjectId,
  quantity: number,
  createdAt: Date,
  updatedAt: Date
}

const itemSchema = new Schema<IItem>({
  itemName: {
    type: String,
    required: [true, "Item name is required"],
    trim: true,
    lowercase: true,
    unique: [true, "List name must be unique"]
  },
  purchased: {
    type: Boolean,
    default: false
  },
  addedBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true
  },
  list: {
    type: mongoose.Types.ObjectId,
    ref: "List",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  }
}, {timestamps: true})

export const Item: Model<IItem> = mongoose.models.Item || mongoose.model<IItem>("Item", itemSchema)