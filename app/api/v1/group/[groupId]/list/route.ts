import { errorResponse, successResponse } from "@/lib/apiResponse";
import { connectDB } from "@/lib/db";
import { Group } from "@/lib/models/Group";
import { List } from "@/lib/models/List";
import { getAuthUser } from "@/lib/protect";
import { listSchema } from "@/lib/validations/models";
import { NextRequest } from "next/server";

interface Params {
  params: Promise<{groupId: string}>
}

export async function POST(request: NextRequest, {params}: Params){
  try{
    const authUser = getAuthUser(request)
    const {groupId} = await params
    const body = await request.json()

    const parsed = listSchema.safeParse(body)
    if(!parsed.success){
      return errorResponse(parsed.error.issues[0].message, 422)
    }

    const {listName} = parsed.data

    await connectDB()

    const group = await Group.findById(groupId)

    if(!group){
      return errorResponse("Group not found", 404)
    }

    const list = await List.create({
      listName,
      group: groupId,
      createdBy: authUser.userId
    })

    return successResponse(list, 201)
  }catch(error){
    if(error instanceof Error && error.message === "Unauthorized"){
      return errorResponse("You are unauthorized", 401)
    }
    console.error("Error in list creation", error)
    return errorResponse("Something went wrong")
  }
}