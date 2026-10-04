import { Navigate, Route, Routes } from "react-router";

import { AuthProvider } from "./auth/AuthProvider";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import { RequireAuth } from "./auth/RequireAuth";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<RequireAuth />}>
          <Route index element={<DashboardPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}