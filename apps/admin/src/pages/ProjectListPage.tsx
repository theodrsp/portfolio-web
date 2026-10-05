import { useState } from "react";
import { useNavigate } from "react-router";
import { Badge, Button } from "@portfolio/ui";
import { ApiError } from "../lib/api";
import {
  PROJECT_CONFIG,
  useDeleteProject,
  useProjects,
  type ProjectRecord,
  type ProjectType,
} from "../lib/projects";
import { PageHeader } from "../components/PageHeader";
import { DataTable, type Column } from "../components/DataTable";
import { ConfirmDialog } from "../components/ConfirmDialog";

export default function ProjectListPage({ type }: { type: ProjectType }) {
  const cfg = PROJECT_CONFIG[type];
  const navigate = useNavigate();
  const { data, isLoading, error } = useProjects(type);
  const del = useDeleteProject();
  const [toDelete, setToDelete] = useState<ProjectRecord | null>(null);
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

  const title: Column<ProjectRecord> = {
    key: "title",
    header: "Judul",
    render: (p) => (
      <div>
        <div className="font-medium">{p.titleId}</div>
        <div className="text-xs text-mist">{p.slug}</div>
      </div>
    ),
  };

  const typeColumns: Column<ProjectRecord>[] =
    type === "APP"
      ? [
          { key: "tags", header: "Teknologi", render: (p) => p.tags.slice(0, 3).join(", ") || "-" },
          {
            key: "featured",
            header: "Unggulan",
            render: (p) => (p.featured ? <Badge variant="gold">Unggulan</Badge> : <span className="text-mist">-</span>),
          },
        ]
      : [
          { key: "tool", header: "Alat", render: (p) => p.tool ?? "-" },
          {
            key: "student",
            header: "Murid",
            render: (p) =>
              `${p.studentDisplayName ?? "-"}${p.studentAgeRange ? ` (${p.studentAgeRange} th)` : ""}`,
          },
        ];

  const columns: Column<ProjectRecord>[] = [
    title,
    ...typeColumns,
    {
      key: "status",
      header: "Status",
      render: (p) =>
        p.status === "PUBLISHED" ? <Badge variant="success">Terbit</Badge> : <Badge>Draft</Badge>,
    },
    { key: "order", header: "Urutan", render: (p) => p.order },
    {
      key: "actions",
      header: "",
      className: "whitespace-nowrap text-right",
      render: (p) => (
        <>
          <Button variant="ghost" onClick={() => navigate(`${cfg.base}/${p.id}`)}>
            Edit
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setDeleteError(null);
              setToDelete(p);
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
        title={cfg.title}
        description={cfg.description}
        action={<Button onClick={() => navigate(`${cfg.base}/new`)}>{cfg.add}</Button>}
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
      {data && (
        <DataTable columns={columns} rows={data} getRowKey={(p) => p.id} emptyText={`Belum ada ${cfg.noun}.`} />
      )}

      <ConfirmDialog
        open={toDelete !== null}
        title={`Hapus ${cfg.noun}?`}
        message={toDelete ? `"${toDelete.titleId}" akan dihapus permanen.` : ""}
        busy={del.isPending}
        onCancel={() => setToDelete(null)}
        onConfirm={() => void confirmDelete()}
      />
    </>
  );
}