import { successResponse } from "@/lib/apiResponse";
import { env } from "@/lib/env";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const response = successResponse({ loggedOut: true });

  response.cookies.set("refreshToken", "", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
    sameSite: "lax",
  });

  return response;
}
