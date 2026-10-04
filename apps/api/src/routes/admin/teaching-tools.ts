import { isNotFoundError, parseId, sendValidationError } from "../../lib/http.js";

import { Router } from "express";
import { prisma } from "../../lib/prisma.js";
import { teachingToolInputSchema } from "@portfolio/shared";

export const adminTeachingToolsRouter = Router();

adminTeachingToolsRouter.get("/", async (_req, res) => {
  const tools = await prisma.teachingTool.findMany({
    orderBy: [{ order: "asc" }, { id: "asc" }],
  });
  return res.json(tools);
});

adminTeachingToolsRouter.post("/", async (req, res) => {
  const parsed = teachingToolInputSchema.safeParse(req.body);
  if (!parsed.success) return sendValidationError(res, parsed.error);
  const tool = await prisma.teachingTool.create({ data: parsed.data });
  return res.status(201).json(tool);
});

adminTeachingToolsRouter.put("/:id", async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ message: "ID tidak valid" });
  const parsed = teachingToolInputSchema.safeParse(req.body);
  if (!parsed.success) return sendValidationError(res, parsed.error);
  try {
    const tool = await prisma.teachingTool.update({ where: { id }, data: parsed.data });
    return res.json(tool);
  } catch (e) {
    if (isNotFoundError(e)) return res.status(404).json({ message: "Alat mengajar tidak ditemukan" });
    throw e;
  }
});

adminTeachingToolsRouter.delete("/:id", async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ message: "ID tidak valid" });
  try {
    await prisma.teachingTool.delete({ where: { id } });
    return res.status(204).send();
  } catch (e) {
    if (isNotFoundError(e)) return res.status(404).json({ message: "Alat mengajar tidak ditemukan" });
    throw e;
  }
});