import Image from "next/image";

interface MemberStackProps {
  members: Array<{
    _id: string;
    fullName: string;
    avatarUrl?: string;
  }>;
}

export function MemberStack({ members }: MemberStackProps) {
  return (
    <div className="flex -space-x-2 overflow-hidden">
      {members.slice(0, 4).map((member) => (
        <Image
          key={member._id}
          className="inline-block h-9 w-9 rounded-full object-cover ring-2 ring-white"
          src={
            member.avatarUrl ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
          }
          alt="member"
          width={48} height={48}
        />
      ))}
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-[#0c5443] ring-2 ring-white">
        +2
      </div>
    </div>
  );
}
