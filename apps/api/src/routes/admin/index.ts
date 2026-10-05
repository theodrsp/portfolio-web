import { Router } from "express";
import { adminMessagesRouter } from "./messages.js";
import { adminProfileRouter } from "./profile.js";
import { adminProjectsRouter } from "./projects.js";
import { adminSkillsRouter } from "./skills.js";
import { adminTeachingToolsRouter } from "./teaching-tools.js";
import { adminUploadsRouter } from "./uploads.js";
import { requireAuth } from "../../middleware/requireAuth.js";

export const adminRouter = Router();

adminRouter.use(requireAuth); // satu pintu: semua route di bawah ini wajib login
adminRouter.use("/messages", adminMessagesRouter);
adminRouter.use("/uploads", adminUploadsRouter);
adminRouter.use("/skills", adminSkillsRouter);
adminRouter.use("/profile", adminProfileRouter);
adminRouter.use("/projects", adminProjectsRouter);
adminRouter.use("/teaching-tools", adminTeachingToolsRouter);