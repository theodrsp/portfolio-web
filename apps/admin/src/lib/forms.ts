import type { ApiIssue } from "./api";

export type FieldErrors = Record<string, string>;

const INVALID = "Isian tidak valid";

// Dari hasil validasi Zod di browser
export function zodErrors(issues: ReadonlyArray<{ path: ReadonlyArray<PropertyKey> }>): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of issues) {
    out[String(issue.path[0] ?? "_form")] = INVALID;
  }
  return out;
}

// Dari respons 400 API (path berbentuk "a.b")
export function apiErrors(issues?: ApiIssue[]): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of issues ?? []) {
    out[issue.path.split(".")[0] || "_form"] = INVALID;
  }
  return out;
}

export const blankToNull = (v: string) => (v.trim() === "" ? null : v.trim());

export const parseTags = (v: string) =>
  v.split(",").map((t) => t.trim()).filter(Boolean);

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}