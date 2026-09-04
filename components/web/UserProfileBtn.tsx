"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export function UserProfileBtn(props: React.ComponentProps<typeof Button>) {
  const {user: currentUser} = useAuth()
  if (!currentUser) {
    return null;
  }

  return (
    <Button {...props} className="min-w-0 flex-1 flex-col bg-transparent hover:bg-transparent hover:cursor-pointer">
      <p className="truncate text-sm font-semibold text-white">
        {currentUser && currentUser.fullName}
      </p>
      <p className="truncate text-xs text-slate-400">{currentUser && currentUser.email}</p>
    </Button>
  );
}
