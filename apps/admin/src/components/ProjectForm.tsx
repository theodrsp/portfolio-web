import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { Button, Card, Input } from "@portfolio/ui";
import { projectInputSchema } from "@portfolio/shared";
import { ApiError } from "../lib/api";
import { apiErrors, blankToNull, parseTags, slugify, zodErrors, type FieldErrors } from "../lib/forms";
import { PROJECT_CONFIG, useSaveProject, type ProjectRecord, type ProjectType } from "../lib/projects";
import { FormField } from "./FormField";
import { ImageUploader } from "./ImageUploader";
import { inputClass } from "./styles";

type FormState = {
  slug: string;
  titleId: string;
  titleEn: string;
  summaryId: string;
  summaryEn: string;
  descriptionId: string;
  descriptionEn: string;
  tags: string;
  demoUrl: string;
  repoUrl: string;
  status: string;
  order: string;
  tool: string;
  studentDisplayName: string;
  studentAgeRange: string;
  learningOutcomesId: string;
  learningOutcomesEn: string;
};

function toForm(p?: ProjectRecord): FormState {
  return {
    slug: p?.slug ?? "",
    titleId: p?.titleId ?? "",
    titleEn: p?.titleEn ?? "",
    summaryId: p?.summaryId ?? "",
    summaryEn: p?.summaryEn ?? "",
    descriptionId: p?.descriptionId ?? "",
    descriptionEn: p?.descriptionEn ?? "",
    tags: p?.tags.join(", ") ?? "",
    demoUrl: p?.demoUrl ?? "",
    repoUrl: p?.repoUrl ?? "",
    status: p?.status ?? "DRAFT",
    order: String(p?.order ?? 0),
    tool: p?.tool ?? "",
    studentDisplayName: p?.studentDisplayName ?? "",
    studentAgeRange: p?.studentAgeRange ?? "",
    learningOutcomesId: p?.learningOutcomesId ?? "",
    learningOutcomesEn: p?.learningOutcomesEn ?? "",
  };
}

type Extra = { featured: boolean; cover: string[]; images: string[]; project?: ProjectRecord };

function buildPayload(type: ProjectType, f: FormState, x: Extra) {
  const base = {
    slug: f.slug.trim(),
    titleId: f.titleId.trim(),
    titleEn: f.titleEn.trim(),
    summaryId: f.summaryId.trim(),
    summaryEn: f.summaryEn.trim(),
    status: f.status,
    order: Number(f.order),
  };

  if (type === "APP") {
    return {
      type: "APP" as const,
      ...base,
      descriptionId: blankToNull(f.descriptionId),
      descriptionEn: blankToNull(f.descriptionEn),
      tags: parseTags(f.tags),
      coverUrl: x.cover[0] ?? null,
      images: x.project?.images ?? [], // dipertahankan apa adanya
      featured: x.featured,
      demoUrl: blankToNull(f.demoUrl),
      repoUrl: blankToNull(f.repoUrl),
    };
  }

  return {
    type: "STUDENT_WORK" as const,
    ...base,
    descriptionId: f.descriptionId.trim(),
    descriptionEn: f.descriptionEn.trim(),
    tags: x.project?.tags ?? [],
    coverUrl: x.project?.coverUrl ?? null,
    images: x.images,
    featured: false,
    tool: f.tool.trim(),
    studentDisplayName: f.studentDisplayName.trim(),
    studentAgeRange: f.studentAgeRange.trim(),
    learningOutcomesId: f.learningOutcomesId.trim(),
    learningOutcomesEn: f.learningOutcomesEn.trim(),
  };
}

type TextOpts = { type?: string; hint?: string; required?: boolean; max?: number };

export function ProjectForm({ type, project }: { type: ProjectType; project?: ProjectRecord }) {
  const isApp = type === "APP";
  const cfg = PROJECT_CONFIG[type];
  const navigate = useNavigate();
  const save = useSaveProject();

  const [form, setForm] = useState<FormState>(() => toForm(project));
  const [featured, setFeatured] = useState(project?.featured ?? false);
  const [cover, setCover] = useState<string[]>(project?.coverUrl ? [project.coverUrl] : []);
  const [images, setImages] = useState<string[]>(project?.images ?? []);
  const [slugTouched, setSlugTouched] = useState(Boolean(project));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  function set(field: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function bind(field: keyof FormState) {
    return {
      id: field,
      value: form[field],
      onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        set(field, e.target.value),
    };
  }

  const text = (field: keyof FormState, label: string, opts: TextOpts = {}) => (
    <FormField label={label} htmlFor={field} error={errors[field]} hint={opts.hint}>
      <Input
        {...bind(field)}
        type={opts.type ?? "text"}
        min={opts.type === "number" ? 0 : undefined}
        required={opts.required}
        maxLength={opts.max}
      />
    </FormField>
  );

  const area = (field: keyof FormState, label: string, max: number, required = false, rows = 4, hint?: string) => (
    <FormField label={label} htmlFor={field} error={errors[field]} hint={hint}>
      <textarea {...bind(field)} rows={rows} maxLength={max} required={required} className={inputClass} />
    </FormField>
  );

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    const payload = buildPayload(type, form, { featured, cover, images, project });
    const parsed = projectInputSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(zodErrors(parsed.error.issues));
      setFormError("Periksa kolom yang ditandai.");
      return;
    }
    setErrors({});

    try {
      await save.mutateAsync({ id: project?.id, data: parsed.data });
      navigate(cfg.base);
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) setErrors(apiErrors(err.issues));
      if (err instanceof ApiError && err.status === 409) setErrors({ slug: err.message });
      setFormError(err instanceof ApiError ? err.message : "Tidak dapat terhubung ke server.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
      <Card className="space-y-4">
        <h2 className="font-heading text-lg">Informasi dasar</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Judul (Indonesia)" htmlFor="titleId" error={errors.titleId}>
            <Input {...bind("titleId")} required maxLength={120} />
          </FormField>
          <FormField label="Judul (English)" htmlFor="titleEn" error={errors.titleEn}>
            <Input
              {...bind("titleEn")}
              required
              maxLength={120}
              onChange={(e) => {
                set("titleEn", e.target.value);
                if (!slugTouched) set("slug", slugify(e.target.value));
              }}
            />
          </FormField>
        </div>

        <FormField
          label="Slug"
          htmlFor="slug"
          error={errors.slug}
          hint={
            isApp
              ? "Huruf kecil dan tanda hubung. Terisi otomatis dari judul English."
              : "Dipakai di tautan karya (?karya=slug). Mengubahnya akan memutus tautan lama yang sudah dibagikan."
          }
        >
          <Input
            {...bind("slug")}
            required
            maxLength={80}
            onChange={(e) => {
              setSlugTouched(true);
              set("slug", e.target.value);
            }}
          />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          {area("summaryId", "Ringkasan (Indonesia)", 300, true, 3)}
          {area("summaryEn", "Ringkasan (English)", 300, true, 3)}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Status" htmlFor="status" error={errors.status} hint="Draft tidak tampil di situs publik">
            <select {...bind("status")} className={inputClass}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Terbit</option>
            </select>
          </FormField>
          {text("order", "Urutan", { type: "number", hint: "Angka kecil tampil lebih dulu" })}
        </div>
      </Card>

      {isApp ? (
        <Card className="space-y-4">
          <h2 className="font-heading text-lg">Detail proyek</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {area("descriptionId", "Deskripsi (Indonesia, opsional)", 5000)}
            {area("descriptionEn", "Deskripsi (English, optional)", 5000)}
          </div>
          {text("tags", "Teknologi", { hint: "Pisahkan dengan koma, contoh: Next.js, TypeScript, PostgreSQL" })}
          <div className="grid gap-4 sm:grid-cols-2">
            {text("demoUrl", "URL demo", { type: "url", max: 500 })}
            {text("repoUrl", "URL repositori", { type: "url", max: 500 })}
          </div>
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="size-4 accent-torii"
            />
            Proyek unggulan (tampil lebih besar dengan label Unggulan)
          </label>
          <ImageUploader
            folder="projects"
            label="Gambar sampul"
            value={cover}
            onChange={setCover}
            max={1}
            error={errors.coverUrl ? "Gambar tidak valid." : undefined}
          />
        </Card>
      ) : (
        <>
          <Card className="space-y-4">
            <h2 className="font-heading text-lg">Detail karya</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="Alat"
                htmlFor="tool"
                error={errors.tool}
                hint="Samakan penulisan dengan data seed agar filter di situs cocok"
              >
                <Input {...bind("tool")} list="student-tools" required maxLength={50} />
                <datalist id="student-tools">
                  {["Scratch", "Roblox", "Python", "AI/ML"].map((t) => (
                    <option key={t} value={t} />
                  ))}
                </datalist>
              </FormField>
              {text("studentAgeRange", "Rentang usia murid", { required: true, hint: "Contoh: 9-10" })}
            </div>
            {text("studentDisplayName", "Nama tampilan murid", {
              required: true,
              max: 50,
              hint: "Nama depan atau inisial saja",
            })}
            <div className="grid gap-4 sm:grid-cols-2">
              {area("descriptionId", "Deskripsi karya (Indonesia)", 5000, true, 5)}
              {area("descriptionEn", "Deskripsi karya (English)", 5000, true, 5)}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {area("learningOutcomesId", "Yang dipelajari (Indonesia)", 2000, true, 4, "Ikuti format data seed, misalnya satu poin per baris")}
              {area("learningOutcomesEn", "What was learned (English)", 2000, true, 4)}
            </div>
          </Card>

          <Card className="space-y-4">
            <h2 className="font-heading text-lg">Tangkapan layar</h2>
            <p className="text-sm text-warning">
              Pastikan gambar tidak memuat nama lengkap, akun, atau wajah anak, dan orang tua sudah
              menyetujui karya ini dipublikasikan.
            </p>
            <ImageUploader
              folder="student-works"
              label="Tangkapan layar (gambar pertama jadi yang utama)"
              value={images}
              onChange={setImages}
              max={12}
              error={errors.images ? "Unggah minimal satu tangkapan layar." : undefined}
            />
          </Card>
        </>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={save.isPending}>
          {save.isPending ? "Menyimpan..." : "Simpan"}
        </Button>
        <Button variant="secondary" onClick={() => navigate(cfg.base)}>
          Batal
        </Button>
        {formError && (
          <p role="alert" className="text-sm text-danger">
            {formError}
          </p>
        )}
      </div>
    </form>
  );
}