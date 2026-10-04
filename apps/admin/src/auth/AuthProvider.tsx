import type { ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api, ApiError } from "../lib/api";
import { AuthContext, type AdminUser } from "./auth-context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  // Menanyakan ke API: "siapa yang sedang login?" (401 berarti belum login)
  const { data: user = null, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      try {
        const res = await api.get<{ user: AdminUser }>("/api/auth/me");
        return res.user;
      } catch (e) {
        if (e instanceof ApiError && e.status === 401) return null;
        throw e;
      }
    },
    staleTime: Infinity,
  });

  async function login(email: string, password: string) {
    await api.post("/api/auth/login", { email, password });
    await queryClient.invalidateQueries({ queryKey: ["me"] });
  }

  async function logout() {
    await api.post("/api/auth/logout");
    queryClient.setQueryData(["me"], null);
    // Buang data admin lain yang masih tersimpan di cache
    queryClient.removeQueries({ predicate: (q) => q.queryKey[0] !== "me" });
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}