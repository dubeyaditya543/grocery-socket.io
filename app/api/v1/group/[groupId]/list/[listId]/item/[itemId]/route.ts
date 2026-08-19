import { errorResponse, successResponse } from "@/lib/apiResponse";
import { Group } from "@/lib/models/Group";
import { Item } from "@/lib/models/Item";
import { List } from "@/lib/models/List";
import { getAuthUser } from "@/lib/protect";
import { itemSchema } from "@/lib/validations/models";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

interface Params {
  params: Promise<{ groupId: string; listId: string; itemId: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const authUser = getAuthUser(request);
    const { groupId, listId, itemId } = await params;

    if (
      !mongoose.isValidObjectId(groupId) ||
      !mongoose.isValidObjectId(listId) ||
      !mongoose.isValidObjectId(itemId)
    ) {
      return errorResponse("Invalid group, list or item id provided", 400);
    }

    const group = await Group.exists({ _id: groupId, members: authUser.userId });
    if (!group) {
      return errorResponse("Group not found", 404);
    }

    const list = await List.exists({ _id: listId, group: groupId });
    if (!list) {
      return errorResponse("List not found", 404);
    }

    const item = await Item.findOne({ _id: itemId, list: listId });
    if (!item) {
      return errorResponse("Item not found", 404);
    }

    return successResponse(item, 200);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("You are unauthorized", 403);
    }
    console.error("Something went wrong while fetching item", error);
    return errorResponse("Something went wrong");
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const authUser = getAuthUser(request);
    const { groupId, listId, itemId } = await params;
    const body = await request.json();

    const parsed = itemSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message);
    }

    if (
      !mongoose.isValidObjectId(groupId) ||
      !mongoose.isValidObjectId(listId) ||
      !mongoose.isValidObjectId(itemId)
    ) {
      return errorResponse("Invalid group, list or item id provided", 400);
    }

    const group = await Group.exists({ _id: groupId, members: authUser.userId });
    if (!group) {
      return errorResponse("Group not found", 404);
    }

    const list = await List.exists({ _id: listId, group: groupId });
    if (!list) {
      return errorResponse("List not found", 404);
    }

    const item = await Item.findOne({ _id: itemId, list: listId });
    if (!item) {
      return errorResponse("Item not found", 404);
    }

    item.itemName = parsed.data.itemName;
    item.quantity = parsed.data.quantity ?? item.quantity;
    await item.save();

    const updatedItem = (await item.populate("addedBy", "fullName avatarUrl")).populate(
      "list",
      "listName",
    );

    return successResponse(updatedItem, 200);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("You are unauthorized", 403);
    }
    console.error("Something went wrong while fetching item", error);
    return errorResponse("Something went wrong");
  }
}

export async function DELETE(request: NextRequest, {params}:Params) {
  try {
    const authUser = getAuthUser(request);
    const { groupId, listId, itemId } = await params;
   
    if (
      !mongoose.isValidObjectId(groupId) ||
      !mongoose.isValidObjectId(listId) ||
      !mongoose.isValidObjectId(itemId)
    ) {
      return errorResponse("Invalid group, list or item id provided", 400);
    }

    const group = await Group.exists({ _id: groupId, members: authUser.userId });
    if (!group) {
      return errorResponse("Group not found", 404);
    }

    const list = await List.exists({ _id: listId, group: groupId });
    if (!list) {
      return errorResponse("List not found", 404);
    }

    const item = await Item.findOneAndDelete({ _id: itemId, list: listId });
    if (!item) {
      return errorResponse("Item not found", 404);
    }

    return successResponse({message: "Item deleted successfully"}, 200);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("You are unauthorized", 403);
    }
    console.error("Something went wrong while fetching item", error);
    return errorResponse("Something went wrong");
  }
}