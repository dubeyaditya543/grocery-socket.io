import { errorResponse, successResponse } from "@/lib/apiResponse";
import { connectDB } from "@/lib/db";
import { Group } from "@/lib/models/Group";
import { getAuthUser } from "@/lib/protect";
import { groupSchema } from "@/lib/validations/models";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);

    const body = await request.json();
    const parsed = groupSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 422);
    }

    const { groupName } = parsed.data;

    await connectDB();

    const group = await Group.create({
      groupName,
      createdBy: authUser.userId,
      members: [authUser.userId]
    });

    return successResponse(group, 201);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("You do not have permission", 401);
    }
    console.error("Error while creating group", error);
    return errorResponse("Something went wrong");
  }
}

export async function GET(request: NextRequest){
  try{
    const authUser = getAuthUser(request)
    
    await connectDB()

    const groups = await Group.find({members: authUser.userId}).populate("createdBy", "fullName avatarUrl").populate("members", "fullName avatarUrl").lean()

    return successResponse(groups, 200)
  }catch(error){
    if(error instanceof Error && error.message === "Unauthorized"){
      return errorResponse("You are unauthorized", 403)
    }
    console.error("Somehting went wrong while fetching groups", error)
    return errorResponse("Something went wrong")
  }
}