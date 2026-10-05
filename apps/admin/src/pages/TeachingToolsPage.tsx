import { useState, type FormEvent } from "react";
import { Button, Input } from "@portfolio/ui";
import { teachingToolInputSchema } from "@portfolio/shared";
import { ApiError } from "../lib/api";
import { apiErrors, zodErrors, type FieldErrors } from "../lib/forms";
import {
  useDeleteTeachingTool,
  useSaveTeachingTool,
  useTeachingTools,
  type TeachingTool,
} from "../lib/teaching-tools";
import { PageHeader } from "../components/PageHeader";
import { DataTable, type Column } from "../components/DataTable";
import { FormField } from "../components/FormField";
import { Modal } from "../components/Modal";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { inputClass } from "../components/styles";

type FormProps = { tool?: TeachingTool; onDone: () => void; onCancel: () => void };

function ToolForm({ tool, onDone, onCancel }: FormProps) {
  const save = useSaveTeachingTool();
  const [name, setName] = useState(tool?.name ?? "");
  const [ageRange, setAgeRange] = useState(tool?.ageRange ?? "");
  const [descriptionId, setDescriptionId] = useState(tool?.descriptionId ?? "");
  const [descriptionEn, setDescriptionEn] = useState(tool?.descriptionEn ?? "");
  const [order, setOrder] = useState(String(tool?.order ?? 0));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    const parsed = teachingToolInputSchema.safeParse({
      name: name.trim(),
      ageRange: ageRange.trim(),
      descriptionId: descriptionId.trim(),
      descriptionEn: descriptionEn.trim(),
      order: Number(order),
    });
    if (!parsed.success) {
      setErrors(zodErrors(parsed.error.issues));
      return;
    }
    setErrors({});

    try {
      await save.mutateAsync({ id: tool?.id, data: parsed.data });
      onDone();
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) setErrors(apiErrors(err.issues));
      setFormError(err instanceof ApiError ? err.message : "Tidak dapat terhubung ke server.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Nama alat" htmlFor="tool-name" error={errors.name}>
          <Input id="tool-name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={80} />
        </FormField>
        <FormField
          label="Rentang usia"
          htmlFor="tool-age"
          error={errors.ageRange}
          hint="Samakan format dengan data seed"
        >
          <Input id="tool-age" value={ageRange} onChange={(e) => setAgeRange(e.target.value)} required maxLength={50} />
        </FormField>
      </div>

      <FormField label="Deskripsi (Indonesia)" htmlFor="tool-desc-id" error={errors.descriptionId}>
        <textarea
          id="tool-desc-id"
          value={descriptionId}
          onChange={(e) => setDescriptionId(e.target.value)}
          rows={3}
          maxLength={500}
          required
          className={inputClass}
        />
      </FormField>

      <FormField label="Deskripsi (English)" htmlFor="tool-desc-en" error={errors.descriptionEn}>
        <textarea
          id="tool-desc-en"
          value={descriptionEn}
          onChange={(e) => setDescriptionEn(e.target.value)}
          rows={3}
          maxLength={500}
          required
          className={inputClass}
        />
      </FormField>

      <FormField label="Urutan" htmlFor="tool-order" hint="Angka kecil tampil lebih dulu" error={errors.order}>
        <Input id="tool-order" type="number" min={0} value={order} onChange={(e) => setOrder(e.target.value)} />
      </FormField>

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

export default function TeachingToolsPage() {
  const { data, isLoading, error } = useTeachingTools();
  const del = useDeleteTeachingTool();
  const [editing, setEditing] = useState<TeachingTool | "new" | null>(null);
  const [toDelete, setToDelete] = useState<TeachingTool | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function confirmDelete() {
    if (!toDelete) return;
    try {
      await del.mutateAsync(toDelete.id);
      setToDelete(null);
    } catch (e) {
      setToDelete(null);
      setDeleteError(e instanceof ApiError ? e.message : "Gagal menghapus.");
    }
  }

  const columns: Column<TeachingTool>[] = [
    { key: "name", header: "Nama", render: (t) => <span className="font-medium">{t.name}</span> },
    { key: "age", header: "Rentang usia", render: (t) => t.ageRange },
    {
      key: "desc",
      header: "Deskripsi",
      render: (t) => <span className="line-clamp-2 max-w-md text-mist">{t.descriptionId}</span>,
    },
    { key: "order", header: "Urutan", render: (t) => t.order },
    {
      key: "actions",
      header: "",
      className: "whitespace-nowrap text-right",
      render: (t) => (
        <>
          <Button variant="ghost" onClick={() => setEditing(t)}>
            Edit
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setDeleteError(null);
              setToDelete(t);
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
        title="Alat Mengajar"
        description="Alat yang diajarkan, tampil di bagian Pengalaman Mengajar pada halaman Tentang."
        action={<Button onClick={() => setEditing("new")}>Tambah Alat</Button>}
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
      {data && <DataTable columns={columns} rows={data} getRowKey={(t) => t.id} emptyText="Belum ada alat mengajar." />}

      <Modal
        open={editing !== null}
        title={editing === "new" ? "Tambah Alat Mengajar" : "Edit Alat Mengajar"}
        onClose={() => setEditing(null)}
      >
        {editing !== null && (
          <ToolForm
            key={editing === "new" ? "new" : editing.id}
            tool={editing === "new" ? undefined : editing}
            onDone={() => setEditing(null)}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={toDelete !== null}
        title="Hapus alat mengajar?"
        message={toDelete ? `"${toDelete.name}" akan dihapus permanen.` : ""}
        busy={del.isPending}
        onCancel={() => setToDelete(null)}
        onConfirm={() => void confirmDelete()}
      />
    </>
  );
}