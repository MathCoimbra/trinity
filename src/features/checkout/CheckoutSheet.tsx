"use client";

import Image from "next/image";
import { useState, type FormEvent, type ReactNode } from "react";
import { WhatsAppIcon } from "@/components/ui/icons";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { Sheet } from "@/components/ui/Sheet";
import { calculateTotals, type ResolvedLine } from "@/features/cart/cart-math";
import type { ServiceType, StoreInfo } from "@/lib/catalog/types";
import { formatBRL } from "@/lib/money";
import { openExternal } from "@/lib/open-external";
import {
  buildOrderMessage,
  buildWhatsAppUrl,
  PAYMENT_LABELS,
  SERVICE_LABELS,
  type CustomerDetails,
  type PaymentPreference,
} from "./whatsapp-message";

type CheckoutSheetProps = {
  open: boolean;
  onClose: () => void;
  lines: ResolvedLine[];
  store: StoreInfo;
  onQuantityChange: (productId: string, quantity: number) => void;
  onClearCart: () => void;
};

type FormErrors = Partial<Record<"name" | "address", string>>;

export function CheckoutSheet({ open, onClose, lines, store, onQuantityChange, onClearCart }: CheckoutSheetProps) {
  const availableServices = (Object.keys(SERVICE_LABELS) as ServiceType[]).filter(
    (service) => store.services[service].enabled,
  );
  const [service, setService] = useState<ServiceType>(availableServices[0] ?? "pickup");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [addressComplement, setAddressComplement] = useState("");
  const [payment, setPayment] = useState<PaymentPreference>("pix");
  const [changeFor, setChangeFor] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [sent, setSent] = useState(false);

  const totals = calculateTotals(lines, service, store.services);
  const isDelivery = service === "delivery";
  const blockedByMinimum = totals.missingForMinimumCents > 0;
  const isEmpty = lines.length === 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: FormErrors = {};
    if (!name.trim()) nextErrors.name = "Informe seu nome";
    if (isDelivery && !address.trim()) nextErrors.address = "Informe o endereço de entrega";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || blockedByMinimum || isEmpty) return;

    const customer: CustomerDetails = {
      name: name.trim(),
      service,
      address: address.trim(),
      addressComplement: addressComplement.trim(),
      payment,
      changeFor: changeFor.trim(),
      notes: notes.trim(),
    };
    openExternal(buildWhatsAppUrl(store.whatsapp, buildOrderMessage(lines, totals, customer)));
    setSent(true);
  };

  const handleClose = () => {
    setSent(false);
    onClose();
  };

  if (sent) {
    return (
      <Sheet open={open} onClose={handleClose} title="Pedido enviado">
        <div className="flex flex-col items-center gap-4 px-6 py-10 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-success/15 text-3xl text-success">
            <WhatsAppIcon />
          </span>
          <p className="font-display text-3xl tracking-wide">Quase lá!</p>
          <p className="max-w-xs text-sm text-muted">
            Abrimos o WhatsApp com o resumo do seu pedido. É só enviar a mensagem para confirmar com a loja.
          </p>
          <div className="mt-2 flex w-full max-w-xs flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                onClearCart();
                handleClose();
              }}
              className="h-12 rounded-full bg-fg text-sm font-semibold uppercase tracking-wide text-bg"
            >
              Já enviei, limpar carrinho
            </button>
            <button type="button" onClick={() => setSent(false)} className="h-12 text-sm text-muted underline-offset-4 hover:underline">
              Voltar ao pedido
            </button>
          </div>
        </div>
      </Sheet>
    );
  }

  return (
    <Sheet
      open={open}
      onClose={handleClose}
      title="Seu pedido"
      footer={
        <div className="space-y-3">
          <dl className="space-y-1 text-sm">
            <Row label="Itens" value={formatBRL(totals.itemsCents)} />
            {isDelivery && <Row label="Entrega" value={formatBRL(totals.deliveryFeeCents)} />}
            <Row label="Total" value={formatBRL(totals.totalCents)} strong />
          </dl>
          {blockedByMinimum && (
            <p className="rounded-lg border border-accent/40 bg-accent-soft px-3 py-2 text-xs text-fg">
              Pedido mínimo para delivery é {formatBRL(store.services.delivery.minimumOrderCents)}. Faltam{" "}
              <strong>{formatBRL(totals.missingForMinimumCents)}</strong>.
            </p>
          )}
          <button
            type="submit"
            form="checkout-form"
            disabled={blockedByMinimum || isEmpty}
            className="flex h-13 w-full items-center justify-center gap-2 rounded-full bg-success text-sm font-semibold uppercase tracking-wide text-black transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <WhatsAppIcon className="text-xl" />
            Enviar pedido no WhatsApp
          </button>
        </div>
      }
    >
      <form id="checkout-form" onSubmit={handleSubmit} noValidate className="space-y-6 px-5 py-5">
        <section className="space-y-3">
          {isEmpty && <p className="py-6 text-center text-sm text-muted">Seu carrinho está vazio.</p>}
          {lines.map(({ product, quantity, subtotalCents }) => (
            <div key={product.id} className="flex items-center gap-3">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-surface-2">
                <Image src={product.image} alt="" fill sizes="56px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold uppercase">{product.name}</p>
                <p className="text-xs text-muted tabular-nums">{formatBRL(subtotalCents)}</p>
              </div>
              <QuantityStepper size="sm" value={quantity} onChange={(next) => onQuantityChange(product.id, next)} />
            </div>
          ))}
        </section>

        <Fieldset legend="Como você quer receber?">
          <div className="grid grid-cols-3 gap-2">
            {availableServices.map((option) => (
              <label
                key={option}
                className={`flex min-h-12 cursor-pointer items-center justify-center rounded-lg border px-2 text-center text-xs font-medium transition ${
                  service === option ? "border-accent bg-accent-soft text-fg" : "border-line-strong text-muted"
                }`}
              >
                <input
                  type="radio"
                  name="service"
                  value={option}
                  checked={service === option}
                  onChange={() => setService(option)}
                  className="sr-only"
                />
                {SERVICE_LABELS[option]}
              </label>
            ))}
          </div>
        </Fieldset>

        <Fieldset legend="Seus dados">
          <Field label="Nome" error={errors.name}>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              className={inputClass(errors.name)}
            />
          </Field>
          {isDelivery && (
            <>
              <Field label="Endereço (rua, número, bairro)" error={errors.address}>
                <input
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  autoComplete="street-address"
                  className={inputClass(errors.address)}
                />
              </Field>
              <Field label="Complemento / referência (opcional)">
                <input
                  value={addressComplement}
                  onChange={(event) => setAddressComplement(event.target.value)}
                  className={inputClass()}
                />
              </Field>
            </>
          )}
        </Fieldset>

        <Fieldset legend="Pagamento na entrega/retirada">
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(PAYMENT_LABELS) as PaymentPreference[]).map((option) => (
              <label
                key={option}
                className={`flex min-h-12 cursor-pointer items-center justify-center rounded-lg border px-2 text-center text-xs font-medium transition ${
                  payment === option ? "border-accent bg-accent-soft text-fg" : "border-line-strong text-muted"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={option}
                  checked={payment === option}
                  onChange={() => setPayment(option)}
                  className="sr-only"
                />
                {PAYMENT_LABELS[option]}
              </label>
            ))}
          </div>
          {payment === "cash" && (
            <Field label="Troco para quanto? (opcional)">
              <input
                value={changeFor}
                onChange={(event) => setChangeFor(event.target.value)}
                inputMode="decimal"
                placeholder="R$ 100"
                className={inputClass()}
              />
            </Field>
          )}
        </Fieldset>

        <Field label="Observações (opcional)">
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={2}
            placeholder="Ex.: sabor alternativo, cor do rosh..."
            className={`${inputClass()} h-auto resize-none py-3`}
          />
        </Field>
      </form>
    </Sheet>
  );
}

const inputClass = (error?: string) =>
  `h-12 w-full rounded-lg border bg-bg px-3 text-base text-fg placeholder:text-muted/60 focus:outline-none focus:ring-1 ${
    error ? "border-accent focus:ring-accent" : "border-line-strong focus:border-fg/50 focus:ring-fg/30"
  }`;

function Fieldset({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-3">
      <legend className="mb-3 font-display text-xl tracking-wider text-fg/90">{legend}</legend>
      {children}
    </fieldset>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs text-muted">{label}</span>
      {children}
      {error && <span className="block text-xs text-accent">{error}</span>}
    </label>
  );
}

function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex justify-between ${strong ? "pt-1 text-base font-semibold" : "text-muted"}`}>
      <dt>{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  );
}
