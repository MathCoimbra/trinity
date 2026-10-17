"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { CloseIcon } from "./icons";

type SheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function Sheet({ open, onClose, title, children, footer }: SheetProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    }
    if (!open && dialog.open) dialog.close();
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      aria-label={title}
      className="sheet fixed inset-x-0 bottom-0 top-auto m-0 flex max-h-[92dvh] w-full max-w-none flex-col overflow-clip rounded-t-2xl border border-line bg-surface p-0 text-fg backdrop:bg-black/70 backdrop:backdrop-blur-sm md:inset-0 md:m-auto md:max-h-[85dvh] md:max-w-lg md:rounded-2xl [&:not([open])]:hidden"
    >
      <header className="flex items-center justify-between gap-4 border-b border-line px-5 py-3">
        <h2 className="font-display text-2xl tracking-wide">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          className="-mr-2 grid size-11 place-items-center rounded-full text-xl text-muted transition hover:bg-surface-2 hover:text-fg"
          aria-label="Fechar"
        >
          <CloseIcon />
        </button>
      </header>
      <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>
      {footer && <footer className="pb-safe border-t border-line bg-surface px-5 pt-4">{footer}</footer>}
    </dialog>
  );
}
