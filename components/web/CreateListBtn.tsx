import { Key, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export function CreateListBtn(props: React.ComponentProps<typeof Button>) {
  return (
    <Button
      {...props}
      className="h-10 w-fit gap-1.5 rounded-md bg-[#0c5443] px-4 text-sm font-semibold text-white shadow-xs transition hover:cursor-pointer hover:bg-[#094738]"
    >
      <Plus className="h-4 w-4" />
      <span>New List</span>
    </Button>
  );
}
