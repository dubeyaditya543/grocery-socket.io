import { errorResponse, successResponse } from "@/lib/apiResponse";
import { connectDB } from "@/lib/db";
import { Group } from "@/lib/models/Group";
import { Item } from "@/lib/models/Item";
import { List } from "@/lib/models/List";
import { getAuthUser } from "@/lib/protect";
import { groupSchema } from "@/lib/validations/models";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

interface Params {
  params: Promise<{ groupId: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const authUser = getAuthUser(request);
    const { groupId } = await params;

    if (!mongoose.isValidObjectId(groupId)) {
      return errorResponse("Invalid group id", 400);
    }

    await connectDB();

    const group = await Group.findOne({ _id: groupId, members: authUser.userId }).populate(
      "createdBy",
      "fullName avatarUrl email",
    );
    if (!group) {
      return errorResponse("Unauthorized", 401);
    }

    return successResponse(group, 200);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("You are not authorized", 401);
    }
    console.error("Something went wrong while fetching group", error);
    return errorResponse("Something went wrong", 500);
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const authUser = getAuthUser(request);
    const { groupId } = await params;
    const body = await request.json();

    if (!mongoose.isValidObjectId(groupId)) {
      return errorResponse("Invalid group id", 400);
    }

    const parsed = groupSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message);
    }

    await connectDB();

    const group = await Group.findOne({ _id: groupId, createdBy: authUser.userId });
    if (!group) {
      return errorResponse("Unauthorized", 401);
    }

    if (parsed.data.groupName === group.groupName) {
      return successResponse(group, 200);
    }

    group.groupName = parsed.data.groupName;
    await group.save();

    const updatedGroup = await group.populate("createdBy", "fullName email avatarUrl");

    return successResponse(updatedGroup, 200);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("You are unauthorized", 401);
    }
    console.error("Something went wrong while updating group", error);
    return errorResponse("Something went wrong");
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  let session: mongoose.ClientSession | null = null;
  try {
    const authUser = getAuthUser(request);
    const { groupId } = await params;

    if (!mongoose.isValidObjectId(groupId)) {
      return errorResponse("Invalid group id", 400);
    }

    await connectDB();
    session = await mongoose.startSession();

    const group = await Group.findOne({ _id: groupId, createdBy: authUser.userId });
    if (!group) {
      return errorResponse("Forbidden action", 403);
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

      await Group.deleteOne({
        _id: group._id,
      }).session(session);
    });

    return successResponse({ message: "Group delete successfully" }, 200);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("You are unauthorized", 401);
    }
    console.error("Something went wrong while deleting group", error);
    return errorResponse("Somehting went wrong");
  } finally {
    if (session) await session.endSession();
  }
}
