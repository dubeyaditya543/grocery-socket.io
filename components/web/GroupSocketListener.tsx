"use client";

import { useSocket } from "@/contexts/SocketContext";
import { Wifi, WifiOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface GroupSocketListenerProps {
  groupId: string;
}

export function GroupSocketListener({ groupId }: GroupSocketListenerProps) {
  const { socket, isConnected } = useSocket();
  const router = useRouter();

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.emit("join-group", groupId);

    const handleGroupUpdate = () => {
      console.log("Real time update received");
      router.refresh();
    };

    socket.on("group:updated", handleGroupUpdate);

    return () => {
      socket.emit("leave-group", groupId);
      socket.off("group:updated", handleGroupUpdate);
    };
  }, [socket, isConnected, groupId, router]);

  return (
    <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium shadow-xs">
      {isConnected ? (
        <>
          <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          <Wifi className="h-3.5 w-3.5 text-emerald-600" />
          <span className="text-emerald-700">Live Sync</span>
        </>
      ) : (
        <>
          <span className="h-2 w-2 rounded-full bg-amber-500">
            <WifiOff className="h-3.5 w-3.5 text-amber-600" />
          </span>
          <span className="text-amber-700">Connecting...</span>
        </>
      )}
    </div>
  );
}
