import express, { type ErrorRequestHandler } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { publicRouter } from "./routes/public.js";
import { authRouter } from "./routes/auth.js";
import { adminRouter } from "./routes/admin/index.js";
import { getAllowedOrigins, requireAllowedOrigin } from "./lib/origins.js";
import { contactRouter } from "./routes/contact.js";

const isProd = process.env.NODE_ENV === "production";

export const app = express();

if (isProd) app.set("trust proxy", 1); // di balik proxy hosting, agar IP asli terbaca

app.use(helmet());
app.use(
  cors({
    origin(origin, cb) {
      if (!origin || getAllowedOrigins().includes(origin)) return cb(null, true);
      return cb(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());
app.use("/api", requireAllowedOrigin);

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/contact", contactRouter);
app.use("/api", publicRouter);

app.use((_req, res) => res.status(404).json({ error: "Tidak ditemukan" }));

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const status =
    typeof err === "object" && err !== null && typeof (err as { status?: unknown }).status === "number"
      ? (err as { status: number }).status
      : 500;

  // Kesalahan dari klien (JSON rusak, isi terlalu besar, dll.)
  if (status >= 400 && status < 500) {
    return res.status(status).json({
      message: status === 413 ? "Isi permintaan terlalu besar" : "Permintaan tidak valid",
    });
  }

  console.error(err);
  return res.status(500).json({ message: "Terjadi kesalahan pada server" });
});