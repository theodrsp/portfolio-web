import { Navigate, Route, Routes } from "react-router";

import AdminLayout from "./components/AdminLayout";
import { AuthProvider } from "./auth/AuthProvider";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import { RequireAuth } from "./auth/RequireAuth";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<RequireAuth />}>
          <Route element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="profile" element={<PlaceholderPage title="Profil" />} />
            <Route path="skills" element={<PlaceholderPage title="Skill" />} />
            <Route path="projects" element={<PlaceholderPage title="Proyek Aplikasi" />} />
            <Route path="student-works" element={<PlaceholderPage title="Karya Murid" />} />
            <Route path="teaching-tools" element={<PlaceholderPage title="Alat Mengajar" />} />
            <Route path="messages" element={<PlaceholderPage title="Pesan Masuk" />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}