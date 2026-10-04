import { Router } from "express";
import multer from "multer";
import { uploadImage } from "../../lib/cloudinary.js";

export const adminUploadsRouter = Router();

const FOLDERS = new Set(["projects", "student-works", "profile"]);
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_BYTES, files: 1 },
  // Berkas bertipe lain dilewati, lalu ditolak di bawah karena req.file kosong
  fileFilter: (_req, file, cb) => cb(null, ALLOWED_TYPES.has(file.mimetype)),
});

adminUploadsRouter.post("/", (req, res) => {
  const folder = req.query.folder;
  if (typeof folder !== "string" || !FOLDERS.has(folder)) {
    return res.status(400).json({ message: "Parameter folder tidak valid" });
  }

  upload.single("image")(req, res, async (err: unknown) => {
    if (err instanceof multer.MulterError) {
      const tooBig = err.code === "LIMIT_FILE_SIZE";
      return res
        .status(tooBig ? 413 : 400)
        .json({ message: tooBig ? "Ukuran gambar maksimal 5 MB" : "Berkas tidak valid" });
    }
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Kirim satu gambar JPG, PNG, atau WebP pada field "image"' });
    }

    try {
      const result = await uploadImage(req.file.buffer, folder);
      return res.status(201).json({
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
      });
    } catch (e) {
      console.error("Upload Cloudinary gagal:", e);
      return res.status(502).json({ message: "Gagal mengunggah gambar" });
    }
  });
});