import { errorResponse, successResponse } from "@/lib/apiResponse";
import { connectDB } from "@/lib/db";
import { env } from "@/lib/env";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";
import { User } from "@/lib/models/User";
import { registerSchema } from "@/lib/validations/auth-schema";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 422);
    }

    const { email, password, fullName } = parsed.data;

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse("Email already registered. Please log in", 409);
    }

    await connectDB();

    const user = await User.create({
      fullName,
      email,
      password,
    });

    const tokenPayload = { userId: user._id.toString() };
    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);

    const response = successResponse(
      {
        user: { userId: user._id, fullName, email },
        accessToken,
      },
      201,
    );

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      secure: env.NODE_ENV === "production",
      path: "/",
    });

    return response
  } catch (error) {
    console.error("Signup error", error)
    return errorResponse("Something went wrong", 500)
  }
}
