import { isNotFoundError, isUniqueError, parseId, sendValidationError } from "../../lib/http.js";

import { Router } from "express";
import { prisma } from "../../lib/prisma.js";
import { projectInputSchema } from "@portfolio/shared";

export const adminProjectsRouter = Router();

adminProjectsRouter.get("/", async (req, res) => {
  const type = req.query.type;
  const where =
    type === "APP" || type === "STUDENT_WORK" ? { type: type as "APP" | "STUDENT_WORK" } : {};
  const projects = await prisma.project.findMany({
    where,
    orderBy: [{ order: "asc" }, { id: "asc" }],
  });
  return res.json(projects);
});

adminProjectsRouter.get("/:id", async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ message: "ID tidak valid" });
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) return res.status(404).json({ message: "Proyek tidak ditemukan" });
  return res.json(project);
});

adminProjectsRouter.post("/", async (req, res) => {
  const parsed = projectInputSchema.safeParse(req.body);
  if (!parsed.success) return sendValidationError(res, parsed.error);
  try {
    const project = await prisma.project.create({ data: parsed.data });
    return res.status(201).json(project);
  } catch (e) {
    if (isUniqueError(e)) return res.status(409).json({ message: "Slug sudah dipakai" });
    throw e;
  }
});

adminProjectsRouter.put("/:id", async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ message: "ID tidak valid" });
  const parsed = projectInputSchema.safeParse(req.body);
  if (!parsed.success) return sendValidationError(res, parsed.error);

  const existing = await prisma.project.findUnique({ where: { id }, select: { type: true } });
  if (!existing) return res.status(404).json({ message: "Proyek tidak ditemukan" });
  if (existing.type !== parsed.data.type) {
    return res.status(400).json({ message: "Tipe proyek tidak bisa diubah, buat proyek baru" });
  }

  try {
    const project = await prisma.project.update({ where: { id }, data: parsed.data });
    return res.json(project);
  } catch (e) {
    if (isUniqueError(e)) return res.status(409).json({ message: "Slug sudah dipakai" });
    if (isNotFoundError(e)) return res.status(404).json({ message: "Proyek tidak ditemukan" });
    throw e;
  }
});

adminProjectsRouter.delete("/:id", async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ message: "ID tidak valid" });
  try {
    await prisma.project.delete({ where: { id } });
    return res.status(204).send();
  } catch (e) {
    if (isNotFoundError(e)) return res.status(404).json({ message: "Proyek tidak ditemukan" });
    throw e;
  }
});