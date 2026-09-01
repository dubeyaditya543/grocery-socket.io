"use client";

import { useAuth } from "@/contexts/AuthContext";

export function UserProfileBtn() {
  const {user: currentUser} = useAuth()
  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-semibold text-white">
        {currentUser && currentUser.fullName}
      </p>
      <p className="truncate text-xs text-slate-400">{currentUser && currentUser.email}</p>
    </div>
  );
}
