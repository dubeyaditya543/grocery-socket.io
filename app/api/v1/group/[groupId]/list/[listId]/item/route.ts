import { errorResponse, successResponse } from "@/lib/apiResponse";
import { connectDB } from "@/lib/db";
import { Group } from "@/lib/models/Group";
import { Item } from "@/lib/models/Item";
import { List } from "@/lib/models/List";
import { getAuthUser } from "@/lib/protect";
import { itemSchema } from "@/lib/validations/models";
import { NextRequest } from "next/server";

interface Params {
  params: Promise<{ listId: string, groupId: string }>;
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const authUser = getAuthUser(request);
    const { listId, groupId } = await params;
    const body = await request.json();

    const parsed = itemSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 422);
    }

    await connectDB();

    const group = await Group.findOne({_id: groupId, members: authUser.userId})
    if(!group){
      return errorResponse("Unauthorized", 401)
    }

    const list = await List.findOne({_id: listId, group: groupId});
    if (!list) {
      return errorResponse("List not found", 404);
    }

    const item = await Item.create({
      itemName: parsed.data.itemName,
      quantity: parsed.data.quantity ?? 1,
      addedBy: authUser.userId,
      list: list._id,
    });

    return successResponse(item, 201);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("You are unauthorized", 401);
    }
    console.error("Error in item route", error);
    return errorResponse("Something went wrong with item creation");
  }
}
