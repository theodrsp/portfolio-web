import { NavLink, Outlet } from "react-router";

import { useAuth } from "../auth/auth-context";
import { useState } from "react";

const NAV = [
  { to: "/", label: "Ringkasan", end: true },
  { to: "/profile", label: "Profil" },
  { to: "/skills", label: "Skill" },
  { to: "/projects", label: "Proyek Aplikasi" },
  { to: "/student-works", label: "Karya Murid" },
  { to: "/teaching-tools", label: "Alat Mengajar" },
  { to: "/messages", label: "Pesan Masuk" },
];

function linkClass({ isActive }: { isActive: boolean }) {
  return [
    "block rounded-md border-l-2 px-3 py-2 text-sm transition-colors",
    isActive
      ? "border-torii bg-yoru-light text-washi"
      : "border-transparent text-mist hover:bg-yoru-light hover:text-washi",
  ].join(" ");
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen md:flex">
      {/* Bilah atas, hanya di layar kecil */}
      <header className="flex items-center justify-between border-b border-line bg-yoru px-4 py-3 md:hidden">
        <span className="font-heading text-xl text-maya" lang="zh">
          提摩太
        </span>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="admin-sidebar"
          onClick={() => setOpen((v) => !v)}
          className="rounded-md border border-line px-3 py-1 text-sm"
        >
          {open ? "Tutup" : "Menu"}
        </button>
      </header>

      <aside
        id="admin-sidebar"
        className={[
          "flex-col border-r border-line bg-yoru md:sticky md:top-0 md:h-screen md:w-60 md:shrink-0",
          open ? "flex" : "hidden md:flex",
        ].join(" ")}
      >
        <div className="hidden px-5 py-6 md:block">
          <p className="font-heading text-2xl text-maya" lang="zh">
            提摩太
          </p>
          <p className="text-xs text-mist">Dashboard admin</p>
        </div>

        <nav aria-label="Menu admin" className="flex-1 space-y-1 px-3 py-3 md:py-0">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setOpen(false)}
              className={linkClass}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-line p-4">
          <p className="truncate text-xs text-mist">{user?.email}</p>
          <button
            type="button"
            onClick={() => void logout()}
            className="mt-2 w-full rounded-md border border-line px-3 py-2 text-sm hover:bg-yoru-light"
          >
            Keluar
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  );
}