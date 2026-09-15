"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { joinGroupNotificationAction } from "@/lib/actions/notification-action";

interface AddMemberCardProps {
  groupId: string;
  groupName: string;
}

export function AddMemberCard({ groupId, groupName }: AddMemberCardProps) {
  const { accessToken } = useAuth();
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleAddMember() {
    setLoading(true);
    try {
      const res = await joinGroupNotificationAction(accessToken, username, groupId, groupName);
      if (!res.success) {
        console.error(res.error ?? "Could not join");
        return;
      }
    } catch {
      console.error("Something went wrong");
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
        onClick={handleAddMember}
        className={"cursor-pointer bg-emerald-700 font-semibold text-white hover:bg-emerald-800"}
      >
        {loading ? "Sending..." : "Send"}
      </Button>
    </div>
  );
}
