"use client";

import { CheckCircle2, MoreVertical, Copy } from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { deleteGroupAction } from "@/lib/actions/group-action";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface GroupCardProps {
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
}

interface DeleteGroupProps {
  groupId: string;
}

export function GroupCard({ group }: GroupCardProps) {
  const { user, accessToken } = useAuth();
  const router = useRouter();
  if (!user) {
    return null;
  }

  const isCreator = group.createdBy._id && group.createdBy._id === user.userId;

  async function handleDelete({ groupId }: DeleteGroupProps) {
    const response = await deleteGroupAction(accessToken, groupId);
    if (!response.success) {
      console.error(response.error ?? "Something went wrong");
      return;
    }
  }

  return (
    <div
      className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:cursor-pointer hover:shadow-md"
      onClick={() => router.push(`/dashboard/group/${group._id}`)}
    >
      {/* Header with Title and More Menu */}
      <div className="space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-base font-bold tracking-tight text-slate-900">
            {group.groupName}
          </h3>
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
              <DropdownMenuItem className={"cursor-pointer"}>Edit</DropdownMenuItem>
              <DropdownMenuItem
                className={"cursor-pointer text-red-500"}
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete({ groupId: group._id });
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
        <div className="flex -space-x-2 overflow-hidden px-2 py-2">
          {group.members && group.members.length > 0 ? (
            group.members
              .slice(0, 4)
              .map((member, index) => (
                <Image
                  key={member._id || index}
                  src={
                    member.avatarUrl ||
                    `https://images.unsplash.com/vector-1749124647885-49713a8d2750?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`
                  }
                  alt={member.fullName || "Member"}
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-white"
                  width={48}
                  height={48}
                />
              ))
          ) : (
            <>
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Member 1"
                className="h-8 w-8 rounded-full object-cover ring-2 ring-white"
                width={48}
                height={48}
              />
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                alt="Member 2"
                className="h-8 w-8 rounded-full object-cover ring-2 ring-white"
                width={48}
                height={48}
              />
              <Image
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                alt="Member 3"
                className="h-8 w-8 rounded-full object-cover ring-2 ring-white"
                width={48}
                height={48}
              />
            </>
          )}
        </div>
      </div>

      {/* Item Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-medium">12 / 18 items bought</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-emerald-600" style={{ width: "65%" }} />
        </div>
      </div>

      {/* Join Code Container */}
      <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
        <span className="font-mono text-xs text-slate-600">
          Join Code: <span className="font-semibold text-slate-900">{group.joinCode}</span>
        </span>
        <button
          className="rounded-md p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
          title="Copy Join Code"
        >
          <Copy className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
