import { useState, type FormEvent } from "react";
import { Navigate, useLocation } from "react-router";
import { loginSchema } from "@portfolio/shared";
import { ApiError } from "../lib/api";
import { useAuth } from "../auth/auth-context";

export default function LoginPage() {
  const { user, login } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Sudah login? Langsung teruskan
  if (user) return <Navigate to={from} replace />;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const parsed = loginSchema.safeParse({ email: email.trim(), password });
    if (!parsed.success) {
      setError("Isi email yang valid dan password.");
      return;
    }

    setSubmitting(true);
    try {
      await login(parsed.data.email, parsed.data.password);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError("Email atau password salah.");
      } else if (err instanceof ApiError && err.status === 429) {
        setError("Terlalu banyak percobaan. Coba lagi beberapa menit lagi.");
      } else {
        setError("Tidak dapat terhubung ke server.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-5 rounded-xl border border-line bg-yoru p-8"
      >
        <header className="text-center">
          <h1 className="font-heading text-3xl text-maya" lang="zh">
            提摩太
          </h1>
          <p className="mt-1 text-sm text-mist">Masuk ke dashboard admin</p>
        </header>

        <div className="space-y-1">
          <label htmlFor="email" className="text-sm">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-line bg-kage px-3 py-2 outline-none focus:border-vermilion"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-sm">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-line bg-kage px-3 py-2 outline-none focus:border-vermilion"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-danger">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-torii px-4 py-2 font-medium hover:bg-vermilion disabled:opacity-60"
        >
          {submitting ? "Memproses..." : "Masuk"}
        </button>
      </form>
    </main>
  );
}