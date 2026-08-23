import { errorResponse, successResponse } from "@/lib/apiResponse";
import { connectDB } from "@/lib/db";
import { env } from "@/lib/env";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";
import { User } from "@/lib/models/User";
import { comparePassword } from "@/lib/password";
import { loginSchema } from "@/lib/validations/auth";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 422);
    }

    const { email, password } = parsed.data;

    await connectDB();

    const existingUser = await User.findOne({ email }).select("+password");
    if (!existingUser) {
      return errorResponse("Invalid credentials", 401);
    }

    const isPasswordCorrect = await comparePassword(password, existingUser.password);
    if (!isPasswordCorrect) {
      return errorResponse("Invalid credentials", 401);
    }

    const tokenPayload = { userId: existingUser._id.toString() };
    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);

    const response = successResponse(
      {
        user: {
          userId: existingUser._id,
          fullName: existingUser.fullName,
          username: existingUser.username,
          email,
        },
        accessToken,
      },
      200,
    );

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Login failed", error);
    return errorResponse("Something went wrong", 500);
  }
}
