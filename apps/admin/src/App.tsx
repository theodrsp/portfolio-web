import { Navigate, Route, Routes } from "react-router";

import AdminLayout from "./components/AdminLayout";
import { AuthProvider } from "./auth/AuthProvider";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import ProfilePage from "./pages/ProfilePage";
import ProjectEditPage from "./pages/ProjectEditPage";
import ProjectListPage from "./pages/ProjectListPage";
import { RequireAuth } from "./auth/RequireAuth";
import SkillsPage from "./pages/SkillsPage";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<RequireAuth />}>
          <Route element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="skills" element={<SkillsPage />} />
            <Route path="projects" element={<ProjectListPage type="APP" />} />
            <Route path="projects/new" element={<ProjectEditPage type="APP" />} />
            <Route path="projects/:id" element={<ProjectEditPage type="APP" />} />
            <Route path="student-works" element={<ProjectListPage type="STUDENT_WORK" />} />
            <Route path="student-works/new" element={<ProjectEditPage type="STUDENT_WORK" />} />
            <Route path="student-works/:id" element={<ProjectEditPage type="STUDENT_WORK" />} />
            <Route path="teaching-tools" element={<PlaceholderPage title="Alat Mengajar" />} />
            <Route path="messages" element={<PlaceholderPage title="Pesan Masuk" />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}