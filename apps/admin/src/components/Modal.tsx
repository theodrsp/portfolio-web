import { useEffect, useRef, type ReactNode } from "react";

type Props = { open: boolean; title: string; onClose: () => void; children: ReactNode };

export function Modal({ open, title, onClose, children }: Props) {
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
        onClose();
      }}
      className="m-auto w-full max-w-lg rounded-xl border border-line bg-yoru p-0 text-washi backdrop:bg-black/70"
    >
      <div className="p-6">
        <h2 className="font-heading text-xl">{title}</h2>
        <div className="mt-4">{children}</div>
      </div>
    </dialog>
  );
}