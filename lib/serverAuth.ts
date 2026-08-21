import { cookies } from "next/headers";
import { TokenPayload, verifyRefreshToken } from "./jwt";

export async function getAutUserFromCookies(): Promise<TokenPayload | null>{
  const cookiesStore = await cookies()
  const refreshToken = cookiesStore.get("refreshToken")?.value

  if(!refreshToken){
    return null
  }
  try{
    return verifyRefreshToken(refreshToken)
  }catch{
    return null
  }
}