"use client";

import { useUtilStore } from "@/lib/store/utils-store";
import { Bell } from "lucide-react";
import { ReactNode, useEffect } from "react";

export function NotificationBtn({ children }: { children: ReactNode }) {
  const isNotificationOpen = useUtilStore((state) => state.isNotificationOpen);
  const setIsNotificationOpen = useUtilStore((state) => state.setIsNotificationOpen);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsNotificationOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setIsNotificationOpen]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsNotificationOpen(!isNotificationOpen)}
        className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
      >
        <Bell className="h-4 w-4" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
          2
        </span>
      </button>
      {isNotificationOpen && <div className="absolute top-full right-0 z-50 mt-2">{children}</div>}
    </div>
  );
}
