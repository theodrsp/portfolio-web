import { useState } from "react";
import { Badge, Button, Card } from "@portfolio/ui";
import { ApiError } from "../lib/api";
import {
  useDeleteMessage,
  useMessages,
  useSetMessageRead,
  type ContactMessage,
} from "../lib/messages";
import { PageHeader } from "../components/PageHeader";
import { ConfirmDialog } from "../components/ConfirmDialog";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
}

export default function MessagesPage() {
  const { data, isLoading, error } = useMessages();
  const setRead = useSetMessageRead();
  const del = useDeleteMessage();
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [toDelete, setToDelete] = useState<ContactMessage | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const unreadCount = data?.filter((m) => !m.isRead).length ?? 0;
  const rows = data ? (onlyUnread ? data.filter((m) => !m.isRead) : data) : [];

  async function toggleRead(m: ContactMessage) {
    setActionError(null);
    try {
      await setRead.mutateAsync({ id: m.id, isRead: !m.isRead });
    } catch (e) {
      setActionError(e instanceof ApiError ? e.message : "Gagal memperbarui pesan.");
    }
  }

  async function confirmDelete() {
    if (!toDelete) return;
    try {
      await del.mutateAsync(toDelete.id);
      setToDelete(null);
    } catch (e) {
      setToDelete(null);
      setActionError(e instanceof ApiError ? e.message : "Gagal menghapus pesan.");
    }
  }

  return (
    <>
      <PageHeader
        title="Pesan Masuk"
        description={`Pesan dari form kontak. ${unreadCount} belum dibaca.`}
        action={
          <div className="flex gap-2">
            <Button variant={onlyUnread ? "ghost" : "secondary"} onClick={() => setOnlyUnread(false)}>
              Semua
            </Button>
            <Button variant={onlyUnread ? "secondary" : "ghost"} onClick={() => setOnlyUnread(true)}>
              Belum dibaca
            </Button>
          </div>
        }
      />

      {isLoading && <p className="text-mist">Memuat...</p>}
      {error && (
        <p role="alert" className="text-danger">
          Gagal memuat: {error.message}
        </p>
      )}
      {actionError && (
        <p role="alert" className="mb-4 text-danger">
          {actionError}
        </p>
      )}

      {data && rows.length === 0 && (
        <p className="rounded-xl border border-line bg-yoru p-8 text-center text-sm text-mist">
          {onlyUnread ? "Tidak ada pesan yang belum dibaca." : "Belum ada pesan."}
        </p>
      )}

      <ul className="max-w-3xl space-y-4">
        {rows.map((m) => (
          <li key={m.id}>
            <Card className={m.isRead ? "" : "border-maya/50"}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium">
                    {m.name} {!m.isRead && <Badge variant="gold">Baru</Badge>}
                  </p>
                  <a href={`mailto:${m.email}`} className="text-sm text-mist hover:text-washi">
                    {m.email}
                  </a>
                </div>
                <time dateTime={m.createdAt} className="text-xs text-mist">
                  {formatDate(m.createdAt)}
                </time>
              </div>

              <p className="mt-4 whitespace-pre-wrap break-words text-sm">{m.message}</p>

              <div className="mt-4 flex flex-wrap items-center gap-1">
                <Button variant="ghost" onClick={() => void toggleRead(m)} disabled={setRead.isPending}>
                  {m.isRead ? "Tandai belum dibaca" : "Tandai sudah dibaca"}
                </Button>
                <a
                  href={`mailto:${m.email}?subject=${encodeURIComponent("Re: pesan dari portofolio")}`}
                  className="rounded-lg px-5 py-2.5 text-sm font-medium text-mist transition-colors hover:bg-yoru-light hover:text-washi"
                >
                  Balas lewat email
                </a>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setActionError(null);
                    setToDelete(m);
                  }}
                >
                  Hapus
                </Button>
              </div>
            </Card>
          </li>
        ))}
      </ul>

      <ConfirmDialog
        open={toDelete !== null}
        title="Hapus pesan?"
        message={toDelete ? `Pesan dari ${toDelete.name} akan dihapus permanen.` : ""}
        busy={del.isPending}
        onCancel={() => setToDelete(null)}
        onConfirm={() => void confirmDelete()}
      />
    </>
  );
}