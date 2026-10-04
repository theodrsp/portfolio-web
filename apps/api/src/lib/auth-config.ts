import type { CookieOptions } from "express";

export const COOKIE_NAME = "admin_token";
export const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

const isProd = process.env.NODE_ENV === "production";

// Dipakai saat memasang DAN menghapus cookie, harus identik
export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  path: "/",
};

export function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET belum diisi di .env");
  return secret;
}