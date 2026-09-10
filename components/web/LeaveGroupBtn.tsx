"use client";

import { LogOutIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { leaveGroupAction } from "@/lib/actions/group-action";
import { useRouter } from "next/navigation";

interface LeaveGroupBtnProps {
  groupId: string
}

export function LeaveGroupBtn({groupId}: LeaveGroupBtnProps) {
  const {accessToken} = useAuth()
  const router = useRouter()
  async function handleLeaveGroup(){
    try{
      const response = await leaveGroupAction(accessToken, groupId)
      if(!response.success){
        console.error(response.error ?? "Something went wrong")
      }
      router.push("/dashboard")
    }catch{
      console.error("Something went wrong while leaving group")
    }
  }

  return (
    <Button onClick={handleLeaveGroup} className={"bg-red-700 hover:bg-red-700/80 cursor-pointer text-white h-10"}>
      Leave Group <LogOutIcon />{" "}
    </Button>
  );
}
