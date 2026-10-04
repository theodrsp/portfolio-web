import { Navigate, Outlet, useLocation } from "react-router";

import { useAuth } from "./auth-context";

export function RequireAuth() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <main className="p-8">Memuat...</main>;
  }
  if (!user) {
    // Ingat halaman tujuan, supaya setelah login kembali ke sana
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}