"use client";

import { useAuth } from "@/contexts/AuthContext";
import { joinGroupAction } from "@/lib/actions/group-action";

interface NotificationItemProps {
  message: string;
  groupId: string;
  link?: string;
}

export function NotificationItem({ message, link, groupId }: NotificationItemProps) {
  const { accessToken } = useAuth();

  async function handleAddMember() {
    try {
      const res = await joinGroupAction(accessToken, groupId);
      if (!res.success) {
        console.error(res.error ?? "Something went wrong");
      }
    } catch {
      console.error("Something went wrong");
    }
  }

  return (
    <div className="flex flex-col gap-1 rounded-lg border border-slate-100 bg-slate-50/50 p-2.5 text-xs font-semibold text-slate-700 capitalize transition hover:bg-slate-100">
      <span>{message}.</span>
      {link && (
        <span
          className="shrink-0 cursor-pointer text-emerald-600 hover:text-emerald-700"
          onClick={handleAddMember}
        >
          {link}
        </span>
      )}
    </div>
  );
}
