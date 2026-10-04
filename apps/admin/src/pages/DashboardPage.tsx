import { Link } from "react-router";
import { PageHeader } from "../components/PageHeader";

const SHORTCUTS = [
  { to: "/profile", title: "Profil", text: "Bio, kontak, dan statistik hero" },
  { to: "/skills", title: "Skill", text: "Daftar keahlian dan strip teknologi" },
  { to: "/projects", title: "Proyek Aplikasi", text: "Karya aplikasi buatan sendiri" },
  { to: "/student-works", title: "Karya Murid", text: "Hasil belajar murid" },
  { to: "/teaching-tools", title: "Alat Mengajar", text: "Scratch, Roblox, Python, dan lainnya" },
  { to: "/messages", title: "Pesan Masuk", text: "Pesan dari form kontak" },
];

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Ringkasan" description="Pilih bagian yang ingin dikelola." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {SHORTCUTS.map((s) => (
          <Link
            key={s.to}
            to={s.to}
            className="rounded-xl border border-line bg-yoru p-5 transition-colors hover:bg-yoru-light"
          >
            <h2 className="font-heading text-lg">{s.title}</h2>
            <p className="mt-1 text-sm text-mist">{s.text}</p>
          </Link>
        ))}
      </div>
    </>
  );
}