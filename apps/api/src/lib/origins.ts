import type { NextFunction, Request, Response } from "express";

// Dibaca saat dipanggil (bukan saat file dimuat), agar .env sudah terbaca
export function getAllowedOrigins(): string[] {
  return (process.env.CORS_ORIGINS ?? "http://localhost:3000,http://localhost:5173")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

// Tolak permintaan pengubah data dari origin yang tidak dikenal
export function requireAllowedOrigin(req: Request, res: Response, next: NextFunction) {
  if (SAFE_METHODS.has(req.method)) return next();
  const origin = req.get("origin");
  if (origin && !getAllowedOrigins().includes(origin)) {
    return res.status(403).json({ message: "Origin tidak diizinkan" });
  }
  return next();
}