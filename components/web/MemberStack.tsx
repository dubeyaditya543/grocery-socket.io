import Image from "next/image";
import { AvatarPic } from "./AvatarPic";
import { AvatarGroupCount } from "../ui/avatar";

interface MemberStackProps {
  members: Array<{
    _id: string;
    fullName: string;
    avatarUrl?: string;
  }>;
}

export function MemberStack({ members }: MemberStackProps) {
  return (
    <div className="flex items-center -space-x-2 overflow-hidden">
      {members.slice(0, 4).map((member) => (
        <AvatarPic
          key={member._id}
          _id={member._id}
          fullName={member.fullName}
          avatarUrl={member.avatarUrl}
        />
      ))}
      {members.length - 4 > 0 && (
        <AvatarGroupCount className="bg-green-500 text-sm font-semibold text-white">
          +{members.length}
        </AvatarGroupCount>
      )}
    </div>
  );
}
