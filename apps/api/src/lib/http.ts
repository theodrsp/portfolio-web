import type { Response } from "express";

type ValidationError = {
  issues: ReadonlyArray<{ path: ReadonlyArray<PropertyKey>; message: string }>;
};

// Prisma melempar kode P2002 saat nilai unik (mis. slug) sudah dipakai
export function isUniqueError(e: unknown): boolean {
  return typeof e === "object" && e !== null && (e as { code?: string }).code === "P2002";
}

export function sendValidationError(res: Response, error: ValidationError) {
  return res.status(400).json({
    message: "Data tidak valid",
    issues: error.issues.map((i) => ({
      path: i.path.map(String).join("."),
      message: i.message,
    })),
  });
}

export function parseId(value: unknown): number | null {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
}

// Prisma melempar kode P2025 saat data yang diubah atau dihapus tidak ada
export function isNotFoundError(e: unknown): boolean {
  return typeof e === "object" && e !== null && (e as { code?: string }).code === "P2025";
}