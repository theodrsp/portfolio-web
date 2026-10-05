import type { NextFunction, Request, Response } from "express";

import { Router } from "express";
import { adminMessagesRouter } from "./messages.js";
import { adminProfileRouter } from "./profile.js";
import { adminProjectsRouter } from "./projects.js";
import { adminSkillsRouter } from "./skills.js";
import { adminTeachingToolsRouter } from "./teaching-tools.js";
import { adminUploadsRouter } from "./uploads.js";
import { requireAuth } from "../../middleware/requireAuth.js";
import { scheduleRevalidate } from "../../lib/revalidate.js";

export const adminRouter = Router();

// Bagian admin yang TIDAK mempengaruhi situs publik
const SKIP_PREFIXES = ["/messages", "/uploads"];

function revalidateOnWrite(req: Request, res: Response, next: NextFunction) {
  const isWrite = req.method !== "GET" && req.method !== "HEAD";
  const affectsSite = !SKIP_PREFIXES.some((p) => req.path.startsWith(p));

  if (isWrite && affectsSite) {
    res.on("finish", () => {
      if (res.statusCode >= 200 && res.statusCode < 300) scheduleRevalidate();
    });
  }
  next();
}

adminRouter.use(requireAuth); // satu pintu: semua route di bawah ini wajib login
adminRouter.use(revalidateOnWrite);

adminRouter.use("/messages", adminMessagesRouter);
adminRouter.use("/uploads", adminUploadsRouter);
adminRouter.use("/skills", adminSkillsRouter);
adminRouter.use("/profile", adminProfileRouter);
adminRouter.use("/projects", adminProjectsRouter);
adminRouter.use("/teaching-tools", adminTeachingToolsRouter);