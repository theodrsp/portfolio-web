export * from "./schemas.js";

import { z } from "zod";

const text = (max: number) => z.string().trim().min(1).max(max);

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