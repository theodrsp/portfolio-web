import express, { type ErrorRequestHandler } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { publicRouter } from "./routes/public.js";
import { authRouter } from "./routes/auth.js";
import helmet from "helmet";
import { getAllowedOrigins, requireAllowedOrigin } from "./lib/origins.js";

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
  })
);
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());
app.use("/api", requireAllowedOrigin);

app.use(
  cors({
    origin: (process.env.CORS_ORIGINS ?? "http://localhost:3000,http://localhost:5173").split(","),
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRouter);
app.use("/api", publicRouter);

app.use((_req, res) => res.status(404).json({ error: "Tidak ditemukan" }));

const onError: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Terjadi kesalahan server" });
};
app.use(onError);