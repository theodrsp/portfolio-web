import { useEffect, useRef } from "react";

type Props = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Hapus",
  busy = false,
  onConfirm,
  onCancel,
}: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        e.preventDefault(); // Esc: biarkan parent yang menutup
        onCancel();
      }}
      className="m-auto w-full max-w-sm rounded-xl border border-line bg-yoru p-6 text-washi backdrop:bg-black/70"
    >
      <h2 className="font-heading text-xl">{title}</h2>
      <p className="mt-2 text-sm text-mist">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-line px-4 py-2 text-sm hover:bg-yoru-light"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={busy}
          className="rounded-md bg-torii px-4 py-2 text-sm font-medium hover:bg-vermilion disabled:opacity-60"
        >
          {busy ? "Memproses..." : confirmLabel}
        </button>
      </div>
    </dialog>
  );
}