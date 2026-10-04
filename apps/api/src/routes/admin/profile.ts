import { Router } from "express";
import { profileInputSchema } from "@portfolio/shared";
import { prisma } from "../../lib/prisma.js";
import { sendValidationError } from "../../lib/http.js";


export const adminProfileRouter = Router();

adminProfileRouter.get("/", async (_req, res) => {
  const profile = await prisma.profile.findUnique({ where: { id: 1 } });
  if (!profile) return res.status(404).json({ message: "Profil belum dibuat" });
  return res.json(profile);
});

adminProfileRouter.put("/", async (req, res) => {
  const parsed = profileInputSchema.safeParse(req.body);
  if (!parsed.success) return sendValidationError(res, parsed.error);
  const profile = await prisma.profile.upsert({
    where: { id: 1 },
    update: parsed.data,
    create: { id: 1, ...parsed.data },
  });
  return res.json(profile);
});