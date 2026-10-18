import type { CartTotals, ResolvedLine } from "@/features/cart/cart-math";
import type { ServiceType } from "@/lib/catalog/types";
import { formatBRL } from "@/lib/money";

export type PaymentPreference = "pix" | "card" | "cash";

export type CustomerDetails = {
  name: string;
  service: ServiceType;
  address?: string;
  addressComplement?: string;
  payment: PaymentPreference;
  changeFor?: string;
  notes?: string;
};

export const SERVICE_LABELS: Record<ServiceType, string> = {
  delivery: "Delivery",
  pickup: "Retirada na loja",
  dineIn: "Consumir no local",
};

export const PAYMENT_LABELS: Record<PaymentPreference, string> = {
  pix: "Pix",
  card: "Cartão (maquininha)",
  cash: "Dinheiro",
};

export function buildOrderMessage(lines: ResolvedLine[], totals: CartTotals, customer: CustomerDetails): string {
  const itemLines = lines.map(
    (line) => `• ${line.quantity}x ${line.product.name} — ${formatBRL(line.subtotalCents)}`,
  );

  const serviceLines = [`*Tipo:* ${SERVICE_LABELS[customer.service]}`];
  if (customer.service === "delivery" && customer.address) {
    serviceLines.push(`*Endereço:* ${customer.address}`);
    if (customer.addressComplement) serviceLines.push(`*Complemento:* ${customer.addressComplement}`);
  }

  const paymentLine =
    customer.payment === "cash" && customer.changeFor
      ? `*Pagamento:* ${PAYMENT_LABELS.cash} (troco para ${customer.changeFor})`
      : `*Pagamento:* ${PAYMENT_LABELS[customer.payment]}`;

  const totalLines = [`Itens: ${formatBRL(totals.itemsCents)}`];
  if (totals.deliveryFeeCents > 0) totalLines.push(`Entrega: ${formatBRL(totals.deliveryFeeCents)}`);
  totalLines.push(`*Total: ${formatBRL(totals.totalCents)}*`);

  const sections = [
    "Olá! Quero fazer um pedido:",
    itemLines.join("\n"),
    totalLines.join("\n"),
    [`*Nome:* ${customer.name}`, ...serviceLines, paymentLine].join("\n"),
  ];
  if (customer.notes) sections.push(`*Observações:* ${customer.notes}`);

  return sections.join("\n\n");
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}
