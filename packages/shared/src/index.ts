export * from "./schemas.js";

import { z } from "zod";

const text = (max: number) => z.string().trim().min(1).max(max);

const slug = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya huruf kecil, angka, dan tanda hubung");

// Opsional: kosong/hilang selalu menjadi null, agar PUT benar-benar menimpa
const urlOrNull = z.string().url().max(500).nullish().transform((v) => v ?? null);
const textOrNull = (max: number) =>
  z.string().trim().max(max).nullish().transform((v) => v ?? null);

const projectBase = {
  slug,
  titleId: text(120),
  titleEn: text(120),
  summaryId: text(300),
  summaryEn: text(300),
  descriptionId: textOrNull(5000),
  descriptionEn: textOrNull(5000),
  tags: z.array(text(40)).max(15).default([]),
  coverUrl: urlOrNull,
  images: z.array(z.string().url().max(500)).max(12).default([]),
  featured: z.boolean().default(false),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  order: z.number().int().min(0).default(0),
};

export const appProjectInputSchema = z.object({
  type: z.literal("APP"),
  ...projectBase,
  demoUrl: urlOrNull,
  repoUrl: urlOrNull,
});

export const studentWorkInputSchema = z.object({
  type: z.literal("STUDENT_WORK"),
  ...projectBase,
  // Karya murid: deskripsi wajib, minimal satu tangkapan layar
  descriptionId: text(5000),
  descriptionEn: text(5000),
  images: z.array(z.string().url().max(500)).min(1).max(12),
  tool: text(50),
  studentDisplayName: text(50),
  studentAgeRange: z.string().trim().regex(/^\d{1,2}(-\d{1,2})?$/, "Contoh: 9-10"),
  learningOutcomesId: text(2000),
  learningOutcomesEn: text(2000),
});

export const projectInputSchema = z.discriminatedUnion("type", [
  appProjectInputSchema,
  studentWorkInputSchema,
]);

export const teachingToolInputSchema = z.object({
  name: text(80),
  descriptionId: text(500),
  descriptionEn: text(500),
  ageRange: text(50),
  order: z.number().int().min(0).default(0),
});

export const profileInputSchema = z.object({
  nameDisplay: text(100),
  headlineId: text(200),
  headlineEn: text(200),
  bioId: text(3000),
  bioEn: text(3000),
  photoUrl: z.string().url().max(500).nullish(),
  email: z.string().email(),
  whatsapp: text(100),
  linkedinUrl: z.string().url().max(500),
  githubUrl: z.string().url().max(500),
  cvUrl: z.string().url().max(500).nullish(),
  teachingPhilosophyId: z.string().trim().max(3000).nullish(),
  teachingPhilosophyEn: z.string().trim().max(3000).nullish(),
  projectsDoneCount: z.number().int().min(0).max(100000),
  teachingYears: z.number().int().min(0).max(100000),
  studentsTaught: z.number().int().min(0).max(100000),
});

export const skillInputSchema = z.object({
  name: text(80),
  category: text(50),
  level: z.number().int().min(1).max(5),
  iconKey: text(50),
  order: z.number().int().min(0).default(0),
  showInStrip: z.boolean().default(false),
});