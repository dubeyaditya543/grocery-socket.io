"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Check, MoreVertical } from "lucide-react";
import Image from "next/image";

interface ItemContainerProps {
  item: {
    _id: string;
    itemName: string;
    purchased: boolean;
    addedBy: {
      _id: string;
      fullName: string;
      avatarUrl: string;
    };
    quantity: number;
  };
}

export function ItemContainer({ item }: ItemContainerProps) {
  const { user } = useAuth();
  if (!user) {
    return;
  }
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 p-4 shadow-xs transition hover:border-slate-300">
      <div className="flex items-center gap-3.5">
        <div
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${item.purchased ? "bg-[#0c5443]" : "border-2 bg-white"} text-white`}
        >
          {item.purchased && <Check className="h-4 w-4 stroke-3" />}
        </div>
        <span className={`text-sm font-medium text-slate-500 ${item.purchased && "line-through"}`}>
          {item.itemName}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {item.quantity && (
          <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
            {item.quantity}x
          </span>
        )}

        {item.addedBy?._id !== user.userId && item.addedBy && (
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Added by</span>
            <Image
              src={item.addedBy.avatarUrl || ""}
              alt={item.addedBy.fullName || "User"}
              className="h-6 w-6 rounded-full object-cover"
              width={48}
              height={48}
              loading={"eager"}
            />
          </div>
        )}

        <button className="text-slate-400 hover:text-slate-600">
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
