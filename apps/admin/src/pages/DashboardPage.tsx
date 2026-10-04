import { useAuth } from "../auth/auth-context";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  return (
    <main className="space-y-4 p-8">
      <p>Masuk sebagai <strong>{user?.email}</strong></p>
      <button
        onClick={() => void logout()}
        className="rounded-md border border-line px-4 py-2 hover:bg-yoru-light"
      >
        Keluar
      </button>
    </main>
  );
}