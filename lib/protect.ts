import { NextRequest } from "next/server";
import { TokenPayload, verifyAccessToken } from "./jwt";

export function getAuthUser(request: NextRequest): TokenPayload{
  const authHeader = request.headers.get("Authorization")
  if(!authHeader || !authHeader.startsWith("Bearer ")){
    throw new Error("Unauthorized")
  }

  const token = authHeader.split(" ")[1]
  try{
    return verifyAccessToken(token)
  }catch{
    throw new Error("Unauthorized")
  }
}