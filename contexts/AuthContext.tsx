"use client"

import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

export interface AuthUser {
  id: string;
  fullName: string;
  avatarUrl?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  accessToken: string | null;
  isLoading: boolean;
  setAuth: (user: AuthUser, accessToken: string) => void;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken0] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const setAuth = useCallback((newUser: AuthUser, newAccessToken: string) => {
    setUser(newUser);
    setAccessToken0(newAccessToken);
    setIsLoading(false);
  }, []);

  const clearAuth = useCallback(() => {
    setUser(null);
    setAccessToken0(null);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    async function checkSessson() {
      const res = await fetch("/api/v1/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        clearAuth();
        return;
      }

      const json = await res.json();
      setAuth(json.data.user, json.data.accessToken);
    }
    checkSessson();
  }, [clearAuth, setAuth]);

  return (
    <AuthContext.Provider value={{ user, accessToken, isLoading, setAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue{
  const context = useContext(AuthContext)
  if(!context){
    throw new Error("useAuth must be within an AuthProvider")
  }
  return context
}
