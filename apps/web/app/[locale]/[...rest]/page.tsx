import { notFound } from "next/navigation";

// menangkap semua alamat yang tidak dikenal di bawah /id atau /en,
// agar halaman 404 di atas (yang berada di dalam layout bahasa) yang tampil
export default function CatchAll() {
  notFound();
}
