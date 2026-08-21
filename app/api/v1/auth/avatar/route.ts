import { errorResponse, successResponse } from "@/lib/apiResponse";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { getAuthUser } from "@/lib/protect";
import { uploadImage } from "@/lib/upload-image";
import { NextRequest } from "next/server";

const MAX_IMAGE_SIZE=5 * 1024 * 1024
const ALLOWED_IMAGE_TYPE = ["image/jpg", "image/png", "image/jpeg", "image/webp", "image/gif"]

export async function POST(request: NextRequest){
  try{
    const authUser = getAuthUser(request)
    const formData = await request.formData()
    const image = formData.get("image")

    if(!image){
      return errorResponse("Image is required", 400)
    }

    let imageUrl = ""
    let imagePublicId = ""
    if(image instanceof File && image.size > 0){
      if(image.size > MAX_IMAGE_SIZE){
        return errorResponse("Image must be under 5MB", 422)
      }
      if(!ALLOWED_IMAGE_TYPE.includes(image.type)){
        return errorResponse("Image must be jpeg, webp, png. etc", 422)
      }

      const uploaded = await uploadImage(image, "grocery/profile")
      imageUrl = uploaded.url
      imagePublicId = uploaded.publicId
    }

    await connectDB()

    const user = await User.findById(authUser.userId)
    user!.avatarUrl = imageUrl
    user!.avatarPublicId = imagePublicId
    await user!.save()

    return successResponse({message: "Profile pic uploaded successfully"}, 200)
  }catch(error){
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("You are unauthorized", 403);
    }
    console.error("Something went wrong while uploading image");
    return errorResponse("Something went wrong");
  }
}