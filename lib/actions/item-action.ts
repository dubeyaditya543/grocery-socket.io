"use server";

import mongoose from "mongoose";
import { connectDB } from "../db";
import { List } from "../models/List";
import { Group } from "../models/Group";
import { itemSchema } from "../validations/models";
import { Item } from "../models/Item";
import { revalidatePath } from "next/cache";

export async function createItemAction(
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
    return { success: false, error: "Invalid list or group id" };
  }

  const itemName = formData.get("itemName");
  const rawQuantity = formData.get("quantity");
  const quantity = rawQuantity ? Number(rawQuantity) : undefined;

  const parsed = itemSchema.safeParse({ itemName, listId, quantity });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  let authUser;
  try {
    const { verifyAccessToken } = await import("@/lib/jwt");
    authUser = verifyAccessToken(accessToken);
  } catch {
    return { success: false, error: "Session expired. You must be logged in." };
  }

  try {
    await connectDB();
    const group = await Group.findOne({ _id: groupId, members: authUser.userId });

    if (!group) {
      return { success: false, error: "Forbidden action" };
    }

    const list = await List.findOne({ _id: listId, group: groupId });
    if (!list) {
      return { success: false, error: "No list found" };
    }

    await Item.create({
      itemName: parsed.data.itemName,
      quantity: parsed.data.quantity ?? 1,
      purchased: false,
      list: list._id,
      addedBy: authUser.userId,
    });
  } catch {
    return { success: false, error: "Something went wrong" };
  }

  revalidatePath(`/dashboard/group/${groupId}/list/${listId}/item`);
  return { success: true };
}

export async function deleteItemAction(
  accessToken: string,
  groupId: string,
  listId: string,
  itemId: string,
): Promise<{ success: boolean; error?: string }> {
  if (!accessToken) {
    return { success: false, error: "You must be logged in" };
  }

  if (
    !mongoose.isValidObjectId(groupId) ||
    !mongoose.isValidObjectId(listId) ||
    !mongoose.isValidObjectId(itemId)
  ) {
    return { success: false, error: "Invalid group, list or item id provided" };
  }

  let authUser;
  try {
    const { verifyAccessToken } = await import("@/lib/jwt");
    authUser = verifyAccessToken(accessToken);
  } catch {
    return { success: false, error: "Session expired. Please log in" };
  }

  try {
    await connectDB();
    const group = await Group.exists({ _id: groupId, members: authUser.userId });
    if (!group) {
      return { success: false, error: "No groups found" };
    }

    const list = await List.exists({ _id: listId, group: groupId });
    if (!list) {
      return { success: false, error: "List not found" };
    }

    const item = await Item.findOneAndDelete({ _id: itemId, list: listId });
    if (!item) {
      return { success: false, error: "Item not found" };
    }
  } catch {
    return { success: false, error: "Something went wrong" };
  }

  revalidatePath(`/dashboard/group/${groupId}/list/${listId}/item`);
  return { success: true };
}

export async function patchItemAction(
  accessToken: string | null,
  groupId: string,
  listId: string,
  itemId: string,
  _prevState: { success: boolean; error?: string },
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  if (!accessToken) {
    return { success: false, error: "You must be logged in" };
  }

  if (
    !mongoose.isValidObjectId(groupId) ||
    !mongoose.isValidObjectId(listId) ||
    !mongoose.isValidObjectId(itemId)
  ) {
    return { success: false, error: "Invalid list, group id or itemId" };
  }

  const itemName = formData.get("itemName");
  const rawQuantity = formData.get("quantity");
  const quantity = rawQuantity ? Number(rawQuantity) : undefined;
  const rawPurchased = formData.get("purchased");
  const purchased =
    rawPurchased !== null ? rawPurchased === "true" || rawPurchased === "on" : undefined;

  const parsed = itemSchema.safeParse({ itemName, quantity, purchased });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  let authUser;
  try {
    const { verifyAccessToken } = await import("@/lib/jwt");
    authUser = verifyAccessToken(accessToken);
  } catch {
    return { success: false, error: "Session expired. You must be logged in." };
  }

  try {
    await connectDB();
    const group = await Group.findOne({ _id: groupId, members: authUser.userId });

    if (!group) {
      return { success: false, error: "Forbidden action" };
    }

    const list = await List.findOne({ _id: listId, group: groupId });
    if (!list) {
      return { success: false, error: "No list found" };
    }

    const item = await Item.findOne({ _id: itemId, list: listId });
    if (!item) {
      return { success: false, error: "Item not found" };
    }

    item.itemName = parsed.data.itemName ?? item.itemName;
    item.quantity = parsed.data.quantity ?? item.quantity;
    item.purchased = parsed.data.purchased ?? item.purchased;

    await item.save();
  } catch {
    return { success: false, error: "Something went wrong" };
  }

  revalidatePath(`/dashboard/group/${groupId}/list/${listId}/item`);
  return { success: true };
}
