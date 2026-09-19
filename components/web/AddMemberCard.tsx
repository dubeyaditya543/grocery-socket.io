"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { joinGroupNotificationAction } from "@/lib/actions/notification-action";
import { useSocket } from "@/contexts/SocketContext";
import { toast } from "../ui/toast";

interface AddMemberCardProps {
  groupId: string;
  groupName: string;
}

export function AddMemberCard({ groupId, groupName }: AddMemberCardProps) {
  const { accessToken } = useAuth();
  const { socket } = useSocket();
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSendNotification() {
    if (!username?.trim()) return;
    setLoading(true);
    try {
      const res = await joinGroupNotificationAction(accessToken, username, groupId, groupName);
      if (!res.success) {
        toast.add({ type: "error", description: res.error ?? "Could not send invitation" });
        return;
      }
      if (res.targetUserId) {
        socket?.emit("notification:send", {
          targetUserId: res.targetUserId,
          message: `You have been invited to ${groupName} group`,
        });
      }

      toast.add({ type: "success", description: `Invitation sent to @${username}` });
      setUsername("");
    } catch {
      toast.add({ type: "error", description: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <h3>Add a member to your group</h3>
      <Input
        type="text"
        placeholder="Username"
        value={username || ""}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Button
        onClick={handleSendNotification}
        className={"cursor-pointer bg-emerald-700 font-semibold text-white hover:bg-emerald-800"}
      >
        {loading ? "Sending..." : "Send"}
      </Button>
    </div>
  );
}
