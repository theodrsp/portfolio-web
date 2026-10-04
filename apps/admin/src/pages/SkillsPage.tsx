import { useState, type FormEvent } from "react";
import { Badge, Button, Input } from "@portfolio/ui";
import { skillInputSchema } from "@portfolio/shared";
import { ApiError } from "../lib/api";
import { apiErrors, zodErrors, type FieldErrors } from "../lib/forms";
import { useDeleteSkill, useSaveSkill, useSkills, type Skill } from "../lib/skills";
import { PageHeader } from "../components/PageHeader";
import { DataTable, type Column } from "../components/DataTable";
import { FormField } from "../components/FormField";
import { Modal } from "../components/Modal";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { inputClass } from "../components/styles";

const CATEGORIES = ["Frontend", "Backend", "Database", "Tools", "Mengajar"];

type FormProps = { skill?: Skill; onDone: () => void; onCancel: () => void };

function SkillForm({ skill, onDone, onCancel }: FormProps) {
  const save = useSaveSkill();
  const [name, setName] = useState(skill?.name ?? "");
  const [category, setCategory] = useState(skill?.category ?? "");
  const [level, setLevel] = useState(String(skill?.level ?? 3));
  const [iconKey, setIconKey] = useState(skill?.iconKey ?? "");
  const [order, setOrder] = useState(String(skill?.order ?? 0));
  const [showInStrip, setShowInStrip] = useState(skill?.showInStrip ?? false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    const parsed = skillInputSchema.safeParse({
      name: name.trim(),
      category: category.trim(),
      level: Number(level),
      iconKey: iconKey.trim(),
      order: Number(order),
      showInStrip,
    });
    if (!parsed.success) {
      setErrors(zodErrors(parsed.error.issues));
      return;
    }
    setErrors({});

    try {
      await save.mutateAsync({ id: skill?.id, data: parsed.data });
      onDone();
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) setErrors(apiErrors(err.issues));
      setFormError(err instanceof ApiError ? err.message : "Tidak dapat terhubung ke server.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Nama" htmlFor="skill-name" error={errors.name}>
        <Input id="skill-name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={80} />
      </FormField>

      <FormField label="Kategori" htmlFor="skill-category" error={errors.category}>
        <Input
          id="skill-category"
          list="skill-categories"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          maxLength={50}
        />
        <datalist id="skill-categories">
          {CATEGORIES.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Level" htmlFor="skill-level" hint="1 = pemula, 5 = mahir" error={errors.level}>
          <select id="skill-level" value={level} onChange={(e) => setLevel(e.target.value)} className={inputClass}>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Urutan" htmlFor="skill-order" hint="Angka kecil tampil lebih dulu" error={errors.order}>
          <Input
            id="skill-order"
            type="number"
            min={0}
            value={order}
            onChange={(e) => setOrder(e.target.value)}
          />
        </FormField>
      </div>

      <FormField
        label="Kunci ikon"
        htmlFor="skill-icon"
        hint="Samakan dengan kunci ikon yang dipakai situs (lihat data seed)"
        error={errors.iconKey}
      >
        <Input id="skill-icon" value={iconKey} onChange={(e) => setIconKey(e.target.value)} required maxLength={50} />
      </FormField>

      <label className="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          checked={showInStrip}
          onChange={(e) => setShowInStrip(e.target.checked)}
          className="size-4 accent-torii"
        />
        Tampilkan di strip teknologi (bawah hero)
      </label>

      {formError && (
        <p role="alert" className="text-sm text-danger">
          {formError}
        </p>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" disabled={save.isPending}>
          {save.isPending ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </form>
  );
}

export default function SkillsPage() {
  const { data, isLoading, error } = useSkills();
  const del = useDeleteSkill();
  const [editing, setEditing] = useState<Skill | "new" | null>(null);
  const [toDelete, setToDelete] = useState<Skill | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function confirmDelete() {
    if (!toDelete) return;
    try {
      await del.mutateAsync(toDelete.id);
      setToDelete(null);
    } catch (e) {
      setToDelete(null);
      setDeleteError(e instanceof ApiError ? e.message : "Gagal menghapus skill.");
    }
  }

  const columns: Column<Skill>[] = [
    { key: "name", header: "Nama", render: (s) => <span className="font-medium">{s.name}</span> },
    { key: "category", header: "Kategori", render: (s) => s.category },
    { key: "level", header: "Level", render: (s) => `${s.level}/5` },
    {
      key: "strip",
      header: "Strip",
      render: (s) => (s.showInStrip ? <Badge variant="gold">Strip</Badge> : <span className="text-mist">-</span>),
    },
    { key: "order", header: "Urutan", render: (s) => s.order },
    {
      key: "actions",
      header: "",
      className: "whitespace-nowrap text-right",
      render: (s) => (
        <>
          <Button variant="ghost" onClick={() => setEditing(s)}>
            Edit
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setDeleteError(null);
              setToDelete(s);
            }}
          >
            Hapus
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Skill"
        description="Daftar keahlian di bagian Tentang Saya dan strip teknologi di hero."
        action={<Button onClick={() => setEditing("new")}>Tambah Skill</Button>}
      />

      {isLoading && <p className="text-mist">Memuat...</p>}
      {error && (
        <p role="alert" className="text-danger">
          Gagal memuat: {error.message}
        </p>
      )}
      {deleteError && (
        <p role="alert" className="mb-4 text-danger">
          {deleteError}
        </p>
      )}
      {data && <DataTable columns={columns} rows={data} getRowKey={(s) => s.id} emptyText="Belum ada skill." />}

      <Modal
        open={editing !== null}
        title={editing === "new" ? "Tambah Skill" : "Edit Skill"}
        onClose={() => setEditing(null)}
      >
        {editing !== null && (
          <SkillForm
            key={editing === "new" ? "new" : editing.id}
            skill={editing === "new" ? undefined : editing}
            onDone={() => setEditing(null)}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={toDelete !== null}
        title="Hapus skill?"
        message={toDelete ? `"${toDelete.name}" akan dihapus permanen.` : ""}
        busy={del.isPending}
        onCancel={() => setToDelete(null)}
        onConfirm={() => void confirmDelete()}
      />
    </>
  );
}