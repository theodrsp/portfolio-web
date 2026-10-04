import { Router } from "express";
import { adminProfileRouter } from "./profile.js";
import { adminSkillsRouter } from "./skills.js";
import { requireAuth } from "../../middleware/requireAuth.js";

export const adminRouter = Router();

adminRouter.use(requireAuth); // satu pintu: semua route di bawah ini wajib login
adminRouter.use("/skills", adminSkillsRouter);
adminRouter.use("/profile", adminProfileRouter);