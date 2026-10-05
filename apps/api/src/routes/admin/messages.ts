import { isNotFoundError, parseId, sendValidationError } from "../../lib/http.js";

import { Router } from "express";
import { messageReadInputSchema } from "@portfolio/shared";

import { prisma } from "../../lib/prisma.js";


export const adminMessagesRouter = Router();

adminMessagesRouter.get("/", async (_req, res) => {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 200, // cukup untuk portofolio pribadi
  });
  return res.json(messages);
});

adminMessagesRouter.patch("/:id", async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ message: "ID tidak valid" });
  const parsed = messageReadInputSchema.safeParse(req.body);
  if (!parsed.success) return sendValidationError(res, parsed.error);
  try {
    const message = await prisma.contactMessage.update({
      where: { id },
      data: { isRead: parsed.data.isRead },
    });
    return res.json(message);
  } catch (e) {
    if (isNotFoundError(e)) return res.status(404).json({ message: "Pesan tidak ditemukan" });
    throw e;
  }
});

adminMessagesRouter.delete("/:id", async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ message: "ID tidak valid" });
  try {
    await prisma.contactMessage.delete({ where: { id } });
    return res.status(204).send();
  } catch (e) {
    if (isNotFoundError(e)) return res.status(404).json({ message: "Pesan tidak ditemukan" });
    throw e;
  }
});