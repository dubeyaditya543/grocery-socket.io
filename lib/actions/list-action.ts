"use server";

import mongoose from "mongoose";
import { listSchema } from "../validations/models";
import { connectDB } from "../db";
import { Group } from "../models/Group";
import { List } from "../models/List";
import { revalidatePath } from "next/cache";
import { Item } from "../models/Item";

export async function createListAction(
  accessToken: string | null,
  groupId: string,
  _prevState: { success: boolean; error?: string },
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  if (!accessToken) {
    return { success: false, error: "You must be logged in" };
  }

  if (!mongoose.isValidObjectId(groupId)) {
    return { success: false, error: "Invalid group id" };
  }

  const listName = formData.get("listName");
  const parsed = listSchema.safeParse({listName});

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  let authUser;
  try {
    const { verifyAccessToken } = await import("@/lib/jwt");
    authUser = verifyAccessToken(accessToken);
  } catch {
    return { success: false, error: "Session expired. Please log in again" };
  }

  try {
    await connectDB();
    const group = await Group.findOne({ _id: groupId, members: authUser.userId });

    if (!group) {
      return { success: false, error: "Forbidden action" };
    }

    await List.create({
      listName: parsed.data.listName,
      group: group._id,
      createdBy: authUser.userId,
    });
  } catch {
    return { success: false, error: "Something went wrong" };
  }

  revalidatePath(`/dashboard/group/${groupId}/list`);
  return { success: true };
}

export async function deleteListAction(
  accessToken: string | null,
  groupId: string,
  listId: string,
): Promise<{ success: boolean; error?: string }> {
  if (!accessToken) {
    return { success: false, error: "You must be logged in" };
  }

  if (!mongoose.isValidObjectId(groupId) || !mongoose.isValidObjectId(listId)) {
    return { success: false, error: "Invalid group or list id provided" };
  }

  let authUser;
  try {
    const { verifyAccessToken } = await import("@/lib/jwt");
    authUser = verifyAccessToken(accessToken);
  } catch {
    return { success: false, error: "Session expired. Please log in again" };
  }

  let session: mongoose.ClientSession | null = null;
  try {
    await connectDB();
    session = await mongoose.startSession();

    const list = await List.findOne({ _id: listId, group: groupId, createdBy: authUser.userId });
    if (!list) {
      return { success: false, error: "Forbidden action" };
    }

    await session.withTransaction(async () => {
      await Item.deleteMany({ list: listId }).session(session);
      await List.deleteOne({ _id: list._id }).session(session);
    });
  } catch {
    return { success: false, error: "Something went wrong." };
  } finally {
    if(session) await session.endSession()
  }

  revalidatePath(`/dashboard/group/${groupId}/list`);
  return { success: true };
}

export async function patchListAction(
  accessToken: string | null,
  groupId: string,
  listId: string,
  _prevState: { success: boolean; error?: string },
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  if (!accessToken) {
    return { success: false, error: "You must be logged in" };
  }

  if (!mongoose.isValidObjectId(groupId) || !mongoose.isValidObjectId(listId)) {
    return { success: false, error: "Invalid group or list id" };
  }

  const listName = formData.get("listName");
  const parsed = listSchema.safeParse({listName});

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  let authUser;
  try {
    const { verifyAccessToken } = await import("@/lib/jwt");
    authUser = verifyAccessToken(accessToken);
  } catch {
    return { success: false, error: "Session expired. Please log in again" };
  }

  try {
    await connectDB();
    const group = await Group.findOne({ _id: groupId, members: authUser.userId });

    if (!group) {
      return { success: false, error: "Forbidden action" };
    }

    const updatedList = await List.findOneAndUpdate(
      { _id: listId, group: group._id, createdBy: authUser.userId },
      { listName: parsed.data.listName },
      { new: true },
    );
    if(!updatedList){
      return {success: false, error: "Forbidden action"}
    }
  } catch {
    return { success: false, error: "Something went wrong" };
  }

  revalidatePath(`/dashboard/group/${groupId}/list`);
  return { success: true };
}
