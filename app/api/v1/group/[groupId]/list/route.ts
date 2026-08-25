import { errorResponse, successResponse } from "@/lib/apiResponse";
import { connectDB } from "@/lib/db";
import { Group } from "@/lib/models/Group";
import { List } from "@/lib/models/List";
import { getAuthUser } from "@/lib/protect";
import { listSchema } from "@/lib/validations/models";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

interface Params {
  params: Promise<{ groupId: string }>;
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const authUser = getAuthUser(request);
    const { groupId } = await params;
    const body = await request.json();

    if(!mongoose.isValidObjectId(groupId)){
      return errorResponse("Invalid group id", 400)
    }

    const parsed = listSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 422);
    }

    const { listName } = parsed.data;

    await connectDB();

    const group = await Group.findOne({_id: groupId, members: authUser.userId});

    if (!group) {
      return errorResponse("Group not found", 404);
    }

    const list = await List.create({
      listName,
      group: groupId,
      createdBy: authUser.userId,
    });

    return successResponse(list, 201);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("You are unauthorized", 401);
    }
    console.error("Error in list creation", error);
    return errorResponse("Something went wrong");
  }
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const authUser = getAuthUser(request);
    const { groupId } = await params;

    if (!mongoose.isValidObjectId(groupId)) {
      return errorResponse("Invalid group id", 400);
    }

    await connectDB();

    const group = await Group.exists({ _id: groupId, members: authUser.userId });
    if (!group) {
      return errorResponse("Group not found", 404);
    }

    const lists = await List.find({ group: groupId })
      .populate("createdBy", "fullName email avatarUrl")
      .populate("group", "groupName").lean();

    return successResponse(lists, 200);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("You are unauthorized", 403);
    }
    console.error("Something went wrong while fetching lists", error);
    return errorResponse("Something went wrong");
  }
}