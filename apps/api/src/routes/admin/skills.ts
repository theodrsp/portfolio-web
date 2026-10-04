import { Router } from "express";
import { skillInputSchema } from "@portfolio/shared";
import { prisma } from "../../lib/prisma.js";
import { isNotFoundError, parseId, sendValidationError } from "../../lib/http.js";

export const adminSkillsRouter = Router();

adminSkillsRouter.get("/", async (_req, res) => {
  const skills = await prisma.skill.findMany({
    orderBy: [{ order: "asc" }, { id: "asc" }],
  });
  return res.json(skills);
});

adminSkillsRouter.post("/", async (req, res) => {
  const parsed = skillInputSchema.safeParse(req.body);
  if (!parsed.success) return sendValidationError(res, parsed.error);
  const skill = await prisma.skill.create({ data: parsed.data });
  return res.status(201).json(skill);
});

adminSkillsRouter.put("/:id", async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ message: "ID tidak valid" });
  const parsed = skillInputSchema.safeParse(req.body);
  if (!parsed.success) return sendValidationError(res, parsed.error);
  try {
    const skill = await prisma.skill.update({ where: { id }, data: parsed.data });
    return res.json(skill);
  } catch (e) {
    if (isNotFoundError(e)) return res.status(404).json({ message: "Skill tidak ditemukan" });
    throw e;
  }
});

adminSkillsRouter.delete("/:id", async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ message: "ID tidak valid" });
  try {
    await prisma.skill.delete({ where: { id } });
    return res.status(204).send();
  } catch (e) {
    if (isNotFoundError(e)) return res.status(404).json({ message: "Skill tidak ditemukan" });
    throw e;
  }
});