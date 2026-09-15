"use server"

import mongoose from "mongoose";
import { connectDB } from "../db";
import { User } from "../models/User";
import { Notification } from "../models/Notification";
import { revalidatePath } from "next/cache";

export async function joinGroupNotificationAction(
  accessToken: string | null,
  username: string | null,
  groupId: string,
  groupName: string,
): Promise<{ success: boolean; error?: string }> {
  if (!accessToken) {
    return { success: false, error: "Please log in" };
  }

  if (!mongoose.isValidObjectId(groupId)) {
    return { success: false, error: "Invalid group id provided" };
  }

  let authUser;
  try {
    const { verifyAccessToken } = await import("@/lib/jwt");
    authUser = verifyAccessToken(accessToken);
  } catch {
    return { success: false, error: "Session expired. Please log in again" };
  }

  try {
    await connectDB();
    const user = await User.findOne({ username: username });
    if (!user) {
      return { success: false, error: "User does not exist" };
    }

    await Notification.create({
      message: `You have been invited to ${groupName} group`,
      sentTo: user._id,
      sentBy: authUser.userId,
      groupId: groupId,
      link: "Join now",
    });
  } catch {
    return { success: false, error: "Something went wrong. Try again" };
  }

  revalidatePath("/dashboard");
  return { success: true };
}
