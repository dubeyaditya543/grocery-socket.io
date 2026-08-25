import { Key } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export function JoinGroupBtn(props: React.ComponentProps<typeof Button>) {
  return (
    <Button
      {...props}
      variant="outline"
      className={cn(
        "h-10 gap-2 rounded-xl border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50",
        props.className,
      )}
    >
      <Key className="h-4 w-4 text-slate-500" />
      <span>Join with Code</span>
    </Button>
  );
}
