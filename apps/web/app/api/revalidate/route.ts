import { revalidatePath } from "next/cache";
import { timingSafeEqual } from "node:crypto";

// Perbandingan waktu-konstan, agar rahasia tidak bisa ditebak lewat selisih waktu respons
function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    console.error("[revalidate] REVALIDATE_SECRET belum diisi");
    return Response.json({ message: "Tidak diizinkan" }, { status: 401 });
  }

  const provided = request.headers.get("x-revalidate-secret") ?? "";
  if (!safeEqual(provided, secret)) {
    return Response.json({ message: "Tidak diizinkan" }, { status: 401 });
  }

  // Buang semua halaman jadi (/id, /en, sitemap, dst.) agar dibuat ulang dengan data terbaru
  revalidatePath("/", "layout");
  return Response.json({ revalidated: true, at: new Date().toISOString() });
}