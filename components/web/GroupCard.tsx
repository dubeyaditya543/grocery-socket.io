"use client";

import { CheckCircle2, MoreVertical, Copy, ArrowUp } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { deleteGroupAction, patchGroupAction } from "@/lib/actions/group-action";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { AvatarPic } from "@/components/web/AvatarPic";
import { Progress } from "../ui/progress";
import { toast } from "../ui/toast";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";

export interface GroupCardProps {
  group: {
    _id: string;
    groupName: string;
    members: Array<{
      _id: string;
      fullName: string;
      avatarUrl: string;
    }>;
    createdBy: {
      _id: string;
      fullName: string;
      avatarUrl: string;
    };
    joinCode: string;
  };
  totalItems: number;
  purchasedItems: number;
}

export function GroupCard({ group, purchasedItems, totalItems }: GroupCardProps) {
  const { user, accessToken } = useAuth();
  const [isGroupEditable, setIsGroupEditable] = useState<boolean>(false);
  const [groupName, setGroupName] = useState<string>(group.groupName);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsGroupEditable(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setIsGroupEditable]);

  if (!user) {
    return null;
  }

  const isCreator = group.createdBy._id && group.createdBy._id === user.userId;

  async function handleGroupEdit() {
    try {
      const formData = new FormData();
      formData.append("groupName", groupName);

      const response = await patchGroupAction(accessToken, group._id, { success: false }, formData);

      if (!response.success) {
        console.error(response.error ?? "Something went wrong");
        return;
      }

      setIsGroupEditable(false)
    } catch {
      console.error("Something went wrong internally while updating group name");
    }
  }

  async function handleDelete() {
    const response = await deleteGroupAction(accessToken, group._id);
    if (!response.success) {
      console.error(response.error ?? "Something went wrong");
      return;
    }
  }

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:shadow-md">
      {/* Header with Title and More Menu */}
      <div className="space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <div className={"flex w-full items-center gap-1 hover:cursor-pointer"}>
            {isGroupEditable ? (
              <Input
                type="text"
                value={groupName}
                className="w-30"
                onChange={(e) => setGroupName(e.target.value)}
              />
            ) : (
              <div
                className="flex items-center"
                onClick={() => router.push(`/dashboard/group/${group._id}`)}
              >
                <h3 className="truncate text-base font-bold tracking-tight text-slate-900">
                  {group.groupName}
                </h3>
                <ArrowUp className={"rotate-40 text-gray-500"} size={16} />
              </div>
            )}
          </div>
          {isGroupEditable ? (
            <Button
              className={"cursor-pointer bg-green-700 font-semibold hover:bg-green-800"}
              onClick={() => handleGroupEdit()}
            >
              Save
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    className={"rounded-full bg-green-700 hover:cursor-pointer hover:bg-green-600"}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                }
              />
              <DropdownMenuContent>
                <DropdownMenuItem
                  className={"cursor-pointer"}
                  onClick={() => setIsGroupEditable(true)}
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={"cursor-pointer text-red-500 focus:text-red-500"}
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete();
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Creator / Role Pill */}
        {isCreator && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="h-3.5 w-3.5 fill-emerald-100 text-emerald-600" />
            <span>Creator</span>
          </div>
        )}
      </div>

      {/* Member Avatars Stack */}
      <div className="my-4 flex items-center">
        <div className="flex -space-x-2 overflow-hidden py-1">
          {group.members &&
            group.members.length > 0 &&
            group.members
              .slice(0, 4)
              .map((member, index) => (
                <AvatarPic
                  key={index}
                  fullName={member.fullName}
                  avatarUrl={member.avatarUrl}
                  _id={member._id}
                />
              ))}
        </div>
      </div>

      {/* Item Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-500">
          {totalItems === 0 ? (
            "No Items"
          ) : (
            <span className="font-medium">
              {purchasedItems} / {totalItems}
            </span>
          )}
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <Progress
            value={purchasedItems}
            max={totalItems}
            className={"h-full rounded-full bg-emerald-600"}
          />
        </div>
      </div>

      {/* Join Code Container */}
      <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
        <span className="font-mono text-xs text-slate-600">
          Join Code: <span className="font-semibold text-slate-900">{group.joinCode}</span>
        </span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(group.joinCode);
            toast.add({ type: "success", description: "Copied" });
          }}
          className="cursor-pointer rounded-md p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
          title="Copy Join Code"
        >
          <Copy className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
