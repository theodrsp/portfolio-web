import { z } from "zod";

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

// ---------- Input dari pengunjung ----------
export const projectListQuerySchema = z.object({
  type: projectTypeSchema.optional(),
  featured: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .optional(),
});

// ---------- Aturan karya murid (dipakai di Tahap 4 saat admin menyimpan) ----------
export const projectInputSchema = z
  .object({
    type: projectTypeSchema,
    titleId: z.string().min(1),
    titleEn: z.string().min(1),
    summaryId: z.string().min(1),
    summaryEn: z.string().min(1),
    descriptionId: z.string().nullable().optional(),
    descriptionEn: z.string().nullable().optional(),
    tags: z.array(z.string()),
    coverUrl: z.string().nullable().optional(),
    images: z.array(z.string()),
    demoUrl: z.string().nullable().optional(),
    repoUrl: z.string().nullable().optional(),
    featured: z.boolean().optional(),
    status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
    order: z.number().int().optional(),
    tool: studentToolSchema.nullable().optional(),
    studentDisplayName: z.string().nullable().optional(),
    studentAgeRange: z.string().nullable().optional(),
    learningOutcomesId: z.string().nullable().optional(),
    learningOutcomesEn: z.string().nullable().optional(),
  })
  .superRefine((p, ctx) => {
    if (p.type !== "STUDENT_WORK") return;
    const need = (ok: boolean, path: string, message: string) =>
      ok || ctx.addIssue({ code: "custom", path: [path], message });
    need(p.images.length >= 1, "images", "Karya murid wajib minimal satu tangkapan layar");
    need(!p.demoUrl && !p.repoUrl, "demoUrl", "demoUrl dan repoUrl harus kosong untuk karya murid");
    need(!!p.tool, "tool", "tool wajib diisi");
    need(!!p.studentDisplayName, "studentDisplayName", "Nama tampilan murid wajib diisi (nama depan/inisial)");
    need(!!p.descriptionId && !!p.descriptionEn, "descriptionId", "Deskripsi wajib diisi dua bahasa untuk karya murid");
    need(!!p.learningOutcomesId && !!p.learningOutcomesEn, "learningOutcomesId", "Capaian belajar wajib diisi dua bahasa");
  });

export type ProjectInput = z.infer<typeof projectInputSchema>;

export const messageReadInputSchema = z.object({ isRead: z.boolean() });

export type TeachingToolInput = z.infer<typeof teachingToolInputSchema>;

export const contactInputSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(10).max(2000),
});

export type ContactInput = z.infer<typeof contactInputSchema>;