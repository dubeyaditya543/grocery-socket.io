import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

export function CreateGroupBtn(props: React.ComponentProps<typeof Button>) {
  return (
    <Button
      {...props}
      className={cn(
        "h-10 gap-2 rounded-xl bg-[#0c5443] px-5 text-sm font-semibold text-white transition hover:bg-[#094738]",
        props.className
      )}
    >
      <PlusCircle className="h-4 w-4" />
      <span>Create Group</span>
    </Button>
  );
}
