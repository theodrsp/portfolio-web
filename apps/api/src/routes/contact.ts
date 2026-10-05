import { Router } from "express";
import { contactInputSchema } from "@portfolio/shared";
import { prisma } from "../lib/prisma.js";
import rateLimit from "express-rate-limit";
import { sendValidationError } from "../lib/http.js";

export const contactRouter = Router();

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 jam
  limit: 5,                 // maksimal 5 permintaan per IP per jam
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Terlalu banyak pesan. Coba lagi nanti." },
});

contactRouter.post("/", contactLimiter, async (req, res) => {
  // Honeypot: kolom "website" tersembunyi di form, manusia tidak mengisinya
  const honeypot = typeof req.body?.website === "string" ? req.body.website.trim() : "";
  if (honeypot !== "") {
    return res.status(201).json({ ok: true }); // pura-pura sukses, tidak disimpan
  }

  const parsed = contactInputSchema.safeParse(req.body);
  if (!parsed.success) return sendValidationError(res, parsed.error);

  await prisma.contactMessage.create({ data: parsed.data });
  return res.status(201).json({ ok: true });
});