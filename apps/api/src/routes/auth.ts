import {
  COOKIE_MAX_AGE_MS,
  COOKIE_NAME,
  cookieOptions,
  getSecret,
} from "../lib/auth-config";

import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { loginSchema } from "@portfolio/shared";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/requireAuth.js";

export const authRouter = Router();

const DUMMY_HASH = bcrypt.hashSync("password-palsu-untuk-pembanding", 12);

authRouter.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Data tidak valid" });
  }
  const { email, password } = parsed.data;

  const user = await prisma.adminUser.findUnique({ where: { email } });
  const ok = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !ok) {
    return res.status(401).json({ message: "Email atau password salah" });
  }

  const token = jwt.sign({ sub: String(user.id) }, getSecret(), {
    expiresIn: "7d",
  });
  res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: COOKIE_MAX_AGE_MS });
  return res.json({ ok: true });
});

authRouter.post("/logout", (_req, res) => {
  res.clearCookie(COOKIE_NAME, cookieOptions);
  return res.json({ ok: true });
});

authRouter.get("/me", requireAuth, async (_req, res) => {
  const user = await prisma.adminUser.findUnique({
    where: { id: Number(res.locals.adminId) },
    select: { id: true, email: true },
  });
  if (!user) {
    return res.status(401).json({ message: "Akun tidak ditemukan" });
  }
  return res.json({ user });
});