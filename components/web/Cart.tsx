"use client"

import { Loader2, ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import { useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "../ui/toast";
import { completeAllAction } from "@/lib/actions/item-action";

interface CartProps {
  totalItems: number;
  purchasedItems: number
}

export function Cart({totalItems, purchasedItems}: CartProps) {
  const {accessToken} = useAuth()
  const params = useParams<{groupId: string}>()
  const {socket} = useSocket()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  async function handleCompleteAll() {
    if(purchasedItems === 0){
      toast.add({type: "error", description: "No items have been collected yet"})
      return
    }
    setIsLoading(true)
    try{
      const res = await completeAllAction(accessToken, params.groupId)

      if(!res.success){
        toast.add({type: "error", description: res.error ?? "Failed to complete trip"})
        return
      }

      socket?.emit("group:update", params.groupId)
      
      toast.add({type: "success", description: `Trip completed ${res.count ?? 0} purchased item cleared`})
    }catch {
      toast.add({type: "error", description: "Something went wrong"})
    }finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 left-1/2 z-30 w-[90%] max-w-2xl -translate-x-1/2 rounded-2xl border border-slate-200/80 bg-white/95 p-3.5 shadow-2xl backdrop-blur-md md:left-[calc(50%+8rem)]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <ShoppingCart className="h-5 w-5 text-[#0c5443]" />
          <span>Cart</span>
        </div>

        <div className="text-center text-xs text-slate-600">
          <span className="font-semibold text-slate-900">{purchasedItems} of {totalItems}</span> items collected
        </div>

        <Button onClick={handleCompleteAll} disabled={isLoading || purchasedItems === 0} className="h-9 cursor-pointer rounded-xl bg-[#0c5443] px-4 text-xs font-semibold text-white shadow-xs transition hover:bg-[#094738]">
          {isLoading ? (
            <>
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              Completing...
            </>
          ) : (
            "Complete Trip"
          )}
        </Button>
      </div>
    </div>
  );
}
