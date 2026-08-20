import { errorResponse, successResponse } from "@/lib/apiResponse";
import { connectDB } from "@/lib/db";
import { Group } from "@/lib/models/Group";
import { Item } from "@/lib/models/Item";
import { List } from "@/lib/models/List";
import { getAuthUser } from "@/lib/protect";
import { listSchema } from "@/lib/validations/models";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

interface Params {
  params: Promise<{ listId: string; groupId: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const authUser = getAuthUser(request);
    const { listId, groupId } = await params;

    if (!mongoose.isValidObjectId(listId) || !mongoose.isValidObjectId(groupId)) {
      return errorResponse("Invalid list or group id provided", 400);
    }

    await connectDB();

    const group = await Group.exists({ _id: groupId, members: authUser.userId });
    if (!group) {
      return errorResponse("Group not found", 404);
    }

    const list = await List.findOne({ _id: listId, group: groupId });
    if (!list) {
      return errorResponse("List not found", 404);
    }

    return successResponse(list, 200);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("You are unauthorized", 403);
    }
    console.error("Something went wrong while fetching the list", error);
    return errorResponse("Something went wrong");
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const authUser = getAuthUser(request);
    const { groupId, listId } = await params;
    const body = await request.json();

    if (!mongoose.isValidObjectId(groupId) || !mongoose.isValidObjectId(listId)) {
      return errorResponse("Invalid group or list id", 400);
    }

    const parsed = listSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message);
    }

    await connectDB();

    const list = await List.findOne({ _id: listId, group: groupId, createdBy: authUser.userId });
    if (!list) {
      return errorResponse("List not found", 404);
    }

    list.listName = parsed.data.listName;
    await list.save();

    const updatedList = await list.populate([
      { path: "createdBy", select: "fullName email avatarUrl" },
      { path: "group", select: "groupName" },
    ]);

    return successResponse(updatedList, 200);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("You are unauthorized", 403);
    }
    console.error("Something went wrong while patching list", error);
    return errorResponse("Something went wrong");
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  let session: mongoose.ClientSession | null = null;
  try {
    const authUser = getAuthUser(request);
    const { groupId, listId } = await params;

    if (!mongoose.isValidObjectId(groupId) || !mongoose.isValidObjectId(listId)) {
      return errorResponse("Invalid group or list id");
    }

    await connectDB();
    session = await mongoose.startSession();

    const list = await List.findOne({ _id: listId, group: groupId, createdBy: authUser.userId });
    if (!list) {
      return errorResponse("Forbidden action", 403);
    }

    await session.withTransaction(async () => {
      await Item.deleteMany({
        list: listId,
      }).session(session);

      await List.deleteOne({
        _id: listId,
      }).session(session);
    });

    return successResponse({ message: "List deleted successfully" }, 200);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("You are unauthorized", 403);
    }
    console.error("Something went wrong while deleting list");
    return errorResponse("Something went wrong");
  } finally {
    if (session) await session.endSession();
  }
}
