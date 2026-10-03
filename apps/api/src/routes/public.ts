import {
  profileSchema,
  projectListQuerySchema,
  publicProjectSchema,
  skillSchema,
  teachingToolSchema,
} from "@portfolio/shared";
import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { z } from "zod";

export const publicRouter = Router();

const bad = (error: z.ZodError) => ({
  error: "Parameter tidak valid",
  issues: error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
});

publicRouter.get("/profile", async (_req, res) => {
  const row = await prisma.profile.findUnique({ where: { id: 1 }, omit: { id: true } });
  if (!row) return res.status(404).json({ error: "Profil belum diisi" });
  res.json(profileSchema.parse(row));
});

publicRouter.get("/skills", async (_req, res) => {
  const rows = await prisma.skill.findMany({ orderBy: [{ order: "asc" }, { id: "asc" }] });
  res.json(z.array(skillSchema).parse(rows));
});

publicRouter.get("/teaching-tools", async (_req, res) => {
  const rows = await prisma.teachingTool.findMany({ orderBy: [{ order: "asc" }, { id: "asc" }] });
  res.json(z.array(teachingToolSchema).parse(rows));
});

publicRouter.get("/projects", async (req, res) => {
  const q = projectListQuerySchema.safeParse(req.query);
  if (!q.success) return res.status(400).json(bad(q.error));

  const rows = await prisma.project.findMany({
    where: { status: "PUBLISHED", type: q.data.type, featured: q.data.featured },
    orderBy: [{ order: "asc" }, { id: "asc" }],
  });
  res.json(z.array(publicProjectSchema).parse(rows));
});