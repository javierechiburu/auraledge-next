"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { AuthUser } from "@/lib/types";

export type AuthMode = "login" | "register";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<{ needsConfirmation: boolean }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  // Modal de autenticación
  authOpen: boolean;
  authMode: AuthMode;
  openAuth: (mode?: AuthMode) => void;
  closeAuth: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function postJson(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(json?.error ?? "Error de autenticación.");
  return json;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  const openAuth = useCallback((mode: AuthMode = "login") => {
    setAuthMode(mode);
    setAuthOpen(true);
  }, []);
  const closeAuth = useCallback(() => setAuthOpen(false), []);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const json = await res.json().catch(() => null);
      setUser(json?.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const json = await postJson("/api/auth/login", { email, password });
    setUser(json.user);
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const json = await postJson("/api/auth/register", { email, password });
    // Si requiere confirmación por correo, no hay sesión todavía.
    if (json.needsConfirmation) return { needsConfirmation: true };
    setUser(json.user);
    return { needsConfirmation: false };
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refresh,
        authOpen,
        authMode,
        openAuth,
        closeAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>.");
  return ctx;
}
