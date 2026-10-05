import { z } from "zod";

// ---------- Enum & Tipe Dasar ----------
export const projectTypeSchema = z.enum(["APP", "STUDENT_WORK"]);
export const studentToolSchema = z.enum(["Scratch", "Roblox", "Python", "AI/ML"]);

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// ---------- Bentuk data yang BOLEH keluar ke publik ----------
export const profileSchema = z.object({
  nameDisplay: z.string(),
  headlineId: z.string(),
  headlineEn: z.string(),
  bioId: z.string(),
  bioEn: z.string(),
  photoUrl: z.string().nullable(),
  email: z.string(),
  whatsapp: z.string(),
  linkedinUrl: z.string(),
  githubUrl: z.string(),
  cvUrl: z.string().nullable(),
  teachingPhilosophyId: z.string().nullable().optional(),
  teachingPhilosophyEn: z.string().nullable().optional(),
  projectsDoneCount: z.number().int().min(0),
  teachingYears: z.number().int().min(0),
  studentsTaught: z.number().int().min(0),
});

export const skillSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  category: z.string(),
  level: z.number().int().min(1).max(5),
  iconKey: z.string(),
  order: z.number().int(),
  showInStrip: z.boolean(),
});

export const teachingToolSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  descriptionId: z.string(),
  descriptionEn: z.string(),
  ageRange: z.string(),
  order: z.number().int(),
});

export const publicProjectSchema = z.object({
  id: z.number().int(),
  slug: z.string(),
  type: projectTypeSchema,
  titleId: z.string(),
  titleEn: z.string(),
  summaryId: z.string(),
  summaryEn: z.string(),
  descriptionId: z.string().nullable(),
  descriptionEn: z.string().nullable(),
  tags: z.array(z.string()),
  coverUrl: z.string().nullable(),
  images: z.array(z.string()),
  demoUrl: z.string().nullable(),
  repoUrl: z.string().nullable(),
  featured: z.boolean(),
  order: z.number().int(),
  tool: z.string().nullable(),
  studentDisplayName: z.string().nullable(),
  studentAgeRange: z.string().nullable(),
  learningOutcomesId: z.string().nullable(),
  learningOutcomesEn: z.string().nullable(),
});

export const projectListQuerySchema = z.object({
  type: projectTypeSchema.optional(),
  featured: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .optional(),
});

// ---------- Skema Input Admin (Tahap 6) ----------
const text = (max: number) => z.string().trim().min(1).max(max);

const slug = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya huruf kecil, angka, dan tanda hubung");

const urlOrNull = z.string().url().max(500).nullish().transform((v) => v ?? null);
const textOrNull = (max: number) =>
  z.string().trim().max(max).nullish().transform((v) => v ?? null);

export const imageRef = z
  .string()
  .trim()
  .max(500)
  .refine(
    (v) => (v.startsWith("/") && !v.startsWith("//")) || v.startsWith("https://"),
    "Harus berupa URL https atau path yang diawali /"
  );

const projectBase = {
  slug,
  titleId: text(120),
  titleEn: text(120),
  summaryId: text(300),
  summaryEn: text(300),
  descriptionId: textOrNull(5000),
  descriptionEn: textOrNull(5000),
  tags: z.array(text(40)).max(15).default([]),
  coverUrl: imageRef.nullish().transform((v) => v ?? null),
  images: z.array(imageRef).max(12).default([]),
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
  descriptionId: text(5000),
  descriptionEn: text(5000),
  images: z.array(imageRef).min(1).max(12),
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

export type SkillInput = z.infer<typeof skillInputSchema>;
export type ProfileInput = z.infer<typeof profileInputSchema>;
export type ProjectInput = z.infer<typeof projectInputSchema>;