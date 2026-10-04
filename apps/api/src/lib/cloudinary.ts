import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

let configured = false;

// Dikonfigurasi saat pertama dipakai, agar .env sudah terbaca
function ensureConfigured() {
  if (configured) return;
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error("Kredensial Cloudinary belum lengkap di .env");
  }
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });
  configured = true;
}

export function uploadImage(buffer: Buffer, folder: string): Promise<UploadApiResponse> {
  ensureConfigured();
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `portfolio/${folder}`,
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        // Batasi sisi terpanjang 1600 px agar hemat kuota gratis
        transformation: [{ width: 1600, height: 1600, crop: "limit" }],
      },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error("Upload gagal"));
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}