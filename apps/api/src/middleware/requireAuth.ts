import { COOKIE_NAME, getSecret } from "../lib/auth-config.js";
import type { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) {
    return res.status(401).json({ message: "Perlu login" });
  }

  const secret = getSecret();
  try {
    const payload = jwt.verify(token, secret, { algorithms: ["HS256"] });
    if (typeof payload === "string" || typeof payload.sub !== "string") {
      throw new Error("Payload tidak valid");
    }
    res.locals.adminId = payload.sub;
    return next();
  } catch {
    return res.status(401).json({ message: "Sesi tidak valid atau kedaluwarsa" });
  }
}