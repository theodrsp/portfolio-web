import type { ZodType } from "zod";

const API_URL = process.env.API_URL;

export async function fetchApi<T>(path: string, schema: ZodType<T>): Promise<T> {
  if (!API_URL) throw new Error("API_URL belum diatur di .env.local");

  const res = await fetch(`${API_URL}${path}`, {
    next: { revalidate: 60 }, // data di-cache 60 detik, lalu diperbarui
  });
  if (!res.ok) throw new Error(`Gagal memuat ${path}: ${res.status}`);

  const json = await res.json();
  return schema.parse(json); // validasi: bentuk data salah, langsung error jelas
}