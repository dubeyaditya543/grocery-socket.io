"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  isConnected: false,
});

export function SocketProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

    const socketInstance: Socket = io(socketUrl, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socketInstance.on("connect", () => {
      console.log("🟢 Connected to Socket server:", socketInstance.id);
      setIsConnected(true);
    });

    if (user?.userId) {
      socketInstance.emit("join-user", user.userId);
    }

    socketInstance.on("disconnect", () => {
      console.log("🔴 Disconnected from Socket server");
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.off("connect");
      socketInstance.off("disconnect");
      socketInstance.disconnect();
    };
  }, [user?.userId]);

  useEffect(() => {
    if (socket && isConnected && user?.userId) {
      socket.emit("join-user", user.userId);
    }
  }, [socket, isConnected, user?.userId]);

  const value = useMemo(() => ({ socket, isConnected }), [socket, isConnected]);

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocket(): SocketContextValue {
  return useContext(SocketContext);
}
