import { UserPlus } from "lucide-react";
import { Button } from "../ui/button";

export function AddMemberBtn() {
  return (
    <Button className="h-10 gap-2 cursor-pointer bg-[#0c5443] px-4 font-semibold text-white shadow-xs transition hover:bg-[#094738]">
      <UserPlus className="h-4 w-4" />
      <span>Add Member</span>
    </Button>
  );
}
