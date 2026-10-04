import { useState, type ChangeEvent, type FormEvent } from "react";
import { Badge, Button, Card, Input } from "@portfolio/ui";
import { profileInputSchema } from "@portfolio/shared";
import { ApiError } from "../lib/api";
import { apiErrors, zodErrors, type FieldErrors } from "../lib/forms";
import { useProfile, useSaveProfile, type Profile } from "../lib/profile";
import { PageHeader } from "../components/PageHeader";
import { FormField } from "../components/FormField";
import { inputClass } from "../components/styles";

// Semua kolom disimpan sebagai teks di form, lalu diubah saat dikirim
type FormState = {
  nameDisplay: string;
  headlineId: string;
  headlineEn: string;
  bioId: string;
  bioEn: string;
  teachingPhilosophyId: string;
  teachingPhilosophyEn: string;
  email: string;
  whatsapp: string;
  linkedinUrl: string;
  githubUrl: string;
  photoUrl: string;
  cvUrl: string;
  projectsDoneCount: string;
  teachingYears: string;
  studentsTaught: string;
};

function toForm(p: Profile): FormState {
  return {
    nameDisplay: p.nameDisplay,
    headlineId: p.headlineId,
    headlineEn: p.headlineEn,
    bioId: p.bioId,
    bioEn: p.bioEn,
    teachingPhilosophyId: p.teachingPhilosophyId ?? "",
    teachingPhilosophyEn: p.teachingPhilosophyEn ?? "",
    email: p.email,
    whatsapp: p.whatsapp,
    linkedinUrl: p.linkedinUrl,
    githubUrl: p.githubUrl,
    photoUrl: p.photoUrl ?? "",
    cvUrl: p.cvUrl ?? "",
    projectsDoneCount: String(p.projectsDoneCount),
    teachingYears: String(p.teachingYears),
    studentsTaught: String(p.studentsTaught),
  };
}

const blankToNull = (v: string) => (v.trim() === "" ? null : v.trim());

function toPayload(f: FormState) {
  return {
    nameDisplay: f.nameDisplay.trim(),
    headlineId: f.headlineId.trim(),
    headlineEn: f.headlineEn.trim(),
    bioId: f.bioId.trim(),
    bioEn: f.bioEn.trim(),
    teachingPhilosophyId: blankToNull(f.teachingPhilosophyId),
    teachingPhilosophyEn: blankToNull(f.teachingPhilosophyEn),
    email: f.email.trim(),
    whatsapp: f.whatsapp.trim(),
    linkedinUrl: f.linkedinUrl.trim(),
    githubUrl: f.githubUrl.trim(),
    photoUrl: blankToNull(f.photoUrl),
    cvUrl: blankToNull(f.cvUrl),
    projectsDoneCount: Number(f.projectsDoneCount),
    teachingYears: Number(f.teachingYears),
    studentsTaught: Number(f.studentsTaught),
  };
}

type TextOpts = { type?: string; hint?: string; required?: boolean; max?: number };

function ProfileForm({ profile }: { profile: Profile }) {
  const save = useSaveProfile();
  const [form, setForm] = useState<FormState>(() => toForm(profile));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function bind(field: keyof FormState) {
    return {
      id: field,
      value: form[field],
      onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((f) => ({ ...f, [field]: e.target.value }));
        setSaved(false);
      },
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

  const area = (field: keyof FormState, label: string, max: number, required = false) => (
    <FormField label={label} htmlFor={field} error={errors[field]}>
      <textarea {...bind(field)} rows={6} maxLength={max} required={required} className={inputClass} />
    </FormField>
  );

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    setSaved(false);

    const parsed = profileInputSchema.safeParse(toPayload(form));
    if (!parsed.success) {
      setErrors(zodErrors(parsed.error.issues));
      setFormError("Periksa kolom yang ditandai.");
      return;
    }
    setErrors({});

    try {
      await save.mutateAsync(parsed.data);
      setSaved(true);
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) setErrors(apiErrors(err.issues));
      setFormError(err instanceof ApiError ? err.message : "Tidak dapat terhubung ke server.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
      <Card className="space-y-4">
        <h2 className="font-heading text-lg">Identitas</h2>
        {text("nameDisplay", "Nama tampilan", { required: true, max: 100 })}
        <div className="grid gap-4 sm:grid-cols-2">
          {text("headlineId", "Headline (Indonesia)", { required: true, max: 200 })}
          {text("headlineEn", "Headline (English)", { required: true, max: 200 })}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {area("bioId", "Bio (Indonesia)", 3000, true)}
          {area("bioEn", "Bio (English)", 3000, true)}
        </div>
      </Card>

      <Card className="space-y-4">
        <h2 className="font-heading text-lg">Filosofi mengajar</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {area("teachingPhilosophyId", "Indonesia", 3000)}
          {area("teachingPhilosophyEn", "English", 3000)}
        </div>
      </Card>

      <Card className="space-y-4">
        <h2 className="font-heading text-lg">Kontak dan tautan</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {text("email", "Email", { type: "email", required: true })}
          {text("whatsapp", "WhatsApp", {
            required: true,
            max: 100,
            hint: "Format kode negara tanpa tanda +, contoh 62812xxxxxxx",
          })}
          {text("linkedinUrl", "LinkedIn", { type: "url", required: true, max: 500 })}
          {text("githubUrl", "GitHub", { type: "url", required: true, max: 500 })}
          {text("photoUrl", "URL foto profil", { type: "url", max: 500, hint: "Opsional. Unggah gambar menyusul di 7E" })}
          {text("cvUrl", "URL CV", { type: "url", max: 500, hint: "Opsional" })}
        </div>
      </Card>

      <Card className="space-y-4">
        <h2 className="font-heading text-lg">Statistik hero</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {text("projectsDoneCount", "Proyek selesai", { type: "number", required: true })}
          {text("teachingYears", "Tahun mengajar", { type: "number", required: true })}
          {text("studentsTaught", "Murid diajar", { type: "number", required: true })}
        </div>
      </Card>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={save.isPending}>
          {save.isPending ? "Menyimpan..." : "Simpan perubahan"}
        </Button>
        {saved && <Badge variant="success">Tersimpan</Badge>}
        {formError && (
          <p role="alert" className="text-sm text-danger">
            {formError}
          </p>
        )}
      </div>
    </form>
  );
}

export default function ProfilePage() {
  const { data, isLoading, error } = useProfile();

  return (
    <>
      <PageHeader title="Profil" description="Bio, kontak, dan angka statistik yang tampil di situs publik." />
      {isLoading && <p className="text-mist">Memuat...</p>}
      {error && (
        <p role="alert" className="text-danger">
          Gagal memuat: {error.message}
        </p>
      )}
      {data && <ProfileForm profile={data} />}
    </>
  );
}