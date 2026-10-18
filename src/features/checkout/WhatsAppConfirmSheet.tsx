"use client";

import { WhatsAppIcon } from "@/components/ui/icons";
import { Sheet } from "@/components/ui/Sheet";

type WhatsAppConfirmSheetProps = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function WhatsAppConfirmSheet({ open, onCancel, onConfirm }: WhatsAppConfirmSheetProps) {
  return (
    <Sheet
      open={open}
      onClose={onCancel}
      title="Enviar pelo WhatsApp"
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onCancel}
            className="h-12 flex-1 rounded-full border border-line-strong text-sm font-semibold uppercase tracking-wide text-fg transition hover:border-fg/50"
          >
            Voltar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            autoFocus
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-success text-sm font-semibold uppercase tracking-wide text-black transition hover:brightness-110 active:scale-[0.98]"
          >
            <WhatsAppIcon className="text-lg" />
            Abrir WhatsApp
          </button>
        </div>
      }
    >
      <div className="flex flex-col items-center gap-4 px-6 py-8 text-center">
        <span className="grid size-14 place-items-center rounded-full bg-success/15 text-2xl text-success">
          <WhatsAppIcon />
        </span>
        <p className="max-w-sm text-sm leading-relaxed text-muted">
          Vamos abrir uma <strong className="text-fg">nova aba</strong> com o WhatsApp e o resumo do seu pedido já
          escrito. Lá, é só <strong className="text-fg">enviar a mensagem</strong> para confirmar com a loja.
        </p>
        <p className="text-xs text-muted/80">Se você tiver o WhatsApp instalado no computador, ele pode abrir direto no app.</p>
      </div>
    </Sheet>
  );
}
