import { ApiError, api } from "../lib/api";
import { useRef, useState } from "react";

import { Button } from "@portfolio/ui";
import { resolveImage } from "../lib/images";

type Folder = "projects" | "student-works" | "profile";
type UploadResult = { url: string; publicId: string; width: number; height: number };

const MAX_BYTES = 5 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp"];

type Props = {
  folder: Folder;
  value: string[];
  onChange: (urls: string[]) => void;
  max: number;
  label: string;
  hint?: string;
  error?: string;
};

export function ImageUploader({ folder, value, onChange, max, label, hint, error }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    const room = Math.max(max - value.length, 0);
    const picked = Array.from(files).slice(0, room);
    const notes: string[] = [];
    if (files.length > picked.length) notes.push(`Maksimal ${max} gambar.`);

    setUploading(true);
    const added: string[] = [];
    try {
      for (const file of picked) {
        if (!TYPES.includes(file.type)) {
          notes.push(`"${file.name}" bukan JPG, PNG, atau WebP.`);
          continue;
        }
        if (file.size > MAX_BYTES) {
          notes.push(`"${file.name}" lebih dari 5 MB.`);
          continue;
        }
        const form = new FormData();
        form.append("image", file);
        const res = await api.upload<UploadResult>(`/api/admin/uploads?folder=${folder}`, form);
        added.push(res.url);
      }
    } catch (err) {
      notes.push(err instanceof ApiError ? err.message : "Gagal mengunggah gambar.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }

    setMessage(notes.length > 0 ? notes.join(" ") : null);
    if (added.length > 0) onChange([...value, ...added]);
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  const smallBtn =
    "rounded border border-line px-2 py-1 hover:bg-yoru-light disabled:opacity-40";

  return (
    <div className="space-y-3">
      <p className="text-sm">{label}</p>

      {value.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {value.map((url, i) => (
            <li key={`${url}-${i}`} className="space-y-2 rounded-lg border border-line bg-kage p-2">
              <img
                src={resolveImage(url)}
                alt={`Gambar ${i + 1}`}
                loading="lazy"
                className="aspect-video w-full rounded object-cover"
              />
              <div className="flex items-center justify-between gap-1 text-xs">
                <span className="text-mist">{i === 0 ? "Utama" : `Ke-${i + 1}`}</span>
                <span className="flex gap-1">
                  <button type="button" aria-label="Geser ke kiri" disabled={i === 0} onClick={() => move(i, -1)} className={smallBtn}>
                    ←
                  </button>
                  <button type="button" aria-label="Geser ke kanan" disabled={i === value.length - 1} onClick={() => move(i, 1)} className={smallBtn}>
                    →
                  </button>
                  <button type="button" aria-label="Hapus gambar" onClick={() => remove(i)} className={`${smallBtn} text-danger`}>
                    Hapus
                  </button>
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple={max > 1}
        aria-label={label}
        className="hidden"
        onChange={(e) => void handleFiles(e.target.files)}
      />
      <Button
        variant="secondary"
        disabled={uploading || value.length >= max}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? "Mengunggah..." : "Unggah gambar"}
      </Button>

      <p className="text-xs text-mist">
        JPG, PNG, atau WebP, maksimal 5 MB per gambar. {hint}
      </p>
      {message && <p role="alert" className="text-xs text-warning">{message}</p>}
      {error && <p role="alert" className="text-xs text-danger">{error}</p>}
    </div>
  );
}