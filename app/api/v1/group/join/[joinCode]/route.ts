import { errorResponse, successResponse } from "@/lib/apiResponse";
import { connectDB } from "@/lib/db";
import { Group } from "@/lib/models/Group";
import { getAuthUser } from "@/lib/protect";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

interface Params {
  params: Promise<{joinCode: string}>
}

export async function POST(request: NextRequest, {params}: Params){
  try{
    const authUser = getAuthUser(request)
    const {joinCode} = await params

    await connectDB()

    const group = await Group.findOne({joinCode})
    if(!group){
      return errorResponse("Group does not exist", 404)
    }

    const id = new mongoose.Types.ObjectId(authUser.userId)

    const isMember = group.members.some((memeberId) => memeberId.equals(id))
    if(isMember){
      return errorResponse("You are already a member", 400)
    }

    group.members.push(id)
    await group.save()

    return successResponse(group, 200)
  }catch(error){
    if(error instanceof Error && error.message === "Unauthorized"){
      return errorResponse("You are unauthorized", 403)
    }
    console.error("Something went wrong while joining", error)
    return errorResponse("Something went wrong")
  }
}