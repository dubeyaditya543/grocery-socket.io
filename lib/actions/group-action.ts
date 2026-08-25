"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "../db";
import { Group } from "../models/Group";
import { groupSchema } from "../validations/models";
import mongoose from "mongoose";
import { List } from "../models/List";
import { Item } from "../models/Item";

export async function createGroupAction(
  accessToken: string | null,
  _prevState: { success: boolean; error?: string },
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  if (!accessToken) {
    return { success: false, error: "You must be logged in" };
  }

  let authUser;
  try {
    const { verifyAccessToken } = await import("@/lib/jwt");
    authUser = verifyAccessToken(accessToken);
  } catch {
    return { success: false, error: "Your session is expired. Please log in" };
  }

  const groupName = formData.get("groupName");
  const parsed = groupSchema.safeParse({ groupName });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    await connectDB();
    await Group.create({
      groupName: parsed.data.groupName,
      members: [authUser.userId],
      createdBy: authUser.userId,
    });
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteGroupAction(
  accessToken: string,
  groupId: string,
): Promise<{ success: boolean; error?: string }> {
  if (!accessToken) {
    return { success: false, error: "You must be logged in" };
  }

  if (!mongoose.isValidObjectId(groupId)) {
    return { success: false, error: "Invalid group id" };
  }

  let authUser;
  try {
    const { verifyAccessToken } = await import("@/lib/jwt");
    authUser = verifyAccessToken(accessToken);
  } catch {
    return { success: false, error: "Session expired. Please log in." };
  }

  let session: mongoose.ClientSession | null = null;
  try {
    await connectDB();
    session = await mongoose.startSession();

    const group = await Group.findOne({ _id: groupId, createdBy: authUser.userId });
    if (!group) {
      return { success: false, error: "Forbidden action" };
    }

    await session.withTransaction(async () => {
      const lists = await List.find({ group: groupId }).session(session);
      const listIds = lists.map((list) => list._id);

      await Item.deleteMany({
        list: { $in: listIds },
      }).session(session);

      await List.deleteMany({
        group: group._id,
      }).session(session);

      await Group.deleteOne({ _id: group._id, createdBy: authUser.userId }).session(session);
    });
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  } finally {
    if(session) await session.endSession()
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function patchGroupAction(accessToken: string, groupId: string, _prevState: {success: boolean, error?: string}, formData: FormData): Promise<{success: boolean, error?: string}>{
  if(!accessToken){
    return {success: false, error: "You must be logged in."}
  }

  if(!mongoose.isValidObjectId(groupId)){
    return {success: false, error: "Invalid group id"}
  }

  const groupName = formData.get("groupName")
  const parsed = groupSchema.safeParse({groupName})
  if(!parsed.success){
    return {success: false, error: parsed.error.issues[0].message}
  }

  let authUser;
  try{
    const {verifyAccessToken} = await import("@/lib/jwt");
    authUser = verifyAccessToken(accessToken)
  }catch{
    return {success: false, error: "Session expired. Please log in again."}
  }

  try{
    await connectDB()

    const updatedGroup = await Group.findOneAndUpdate({_id: groupId, createdBy: authUser.userId}, {groupName: parsed.data.groupName}, {new: true})
    if(!updatedGroup){
      return {success: false, error: "Forbidden action"}
    }
  }catch {
    return {success: false, error: "Something went wrong"}
  }

  revalidatePath("/dashboard")
  return {success: true}
}