import { createContext, useContext } from "react";

export type AdminUser = { id: number | string; email: string };

export type AuthState = {
  user: AdminUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthState | null>(null);

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam AuthProvider");
  return ctx;
}