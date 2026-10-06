import { useEffect, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { AuthContext, type AdminUser } from "./auth-context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email ?? "" });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email ?? "" });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function login(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message.toLowerCase().includes("invalid login credentials")) {
        throw new Error("Email atau password salah.");
      }
      throw new Error(error.message);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
    queryClient.clear();
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}