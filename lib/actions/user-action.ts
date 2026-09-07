"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "../db";
import { User } from "../models/User";
import { deleteImage, uploadImage } from "../upload-image";

const MAX_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export async function uploadImageAction(
  accessToken: string | null,
  _prevState: { success: boolean; error?: string },
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  if (!accessToken) {
    return { success: false, error: "Please log in" };
  }

  let authUser;
  try {
    const { verifyAccessToken } = await import("@/lib/jwt");
    authUser = verifyAccessToken(accessToken);
  } catch {
    return { success: false, error: "Session expired. Please log in" };
  }

  const image = formData.get("image");
  let imageUrl = "";
  let imagePublicId = "";

  if (image instanceof File && image.size > 0) {
    if (image.size > MAX_SIZE) {
      return { success: false, error: "Image size must be less than 2MB" };
    }
    if (!ALLOWED_TYPES.includes(image.type)) {
      return { success: false, error: "Unsupported file type provided" };
    }

    try {
      const uplaoded = await uploadImage(image, "basket_sync/users");
      imageUrl = uplaoded.url;
      imagePublicId = uplaoded.publicId;
    } catch {
      return { success: false, error: "Something went wrong while uplaoding the image" };
    }
  }

  try {
    await connectDB();
    const user = await User.findById(authUser.userId);
    if (!user) {
      return { success: false, error: "User does not exist" };
    }
    await deleteImage(user.avatarPublicId)
    user.avatarPublicId = imagePublicId;
    user.avatarUrl = imageUrl;
    await user.save();
  } catch {
    return { success: false, error: "Something went wrong" };
  }
  revalidatePath("/dashboard");
  return { success: true };
}

