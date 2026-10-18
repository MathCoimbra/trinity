import { describe, expect, it } from "vitest";
import type { ResolvedLine } from "@/features/cart/cart-math";
import { buildOrderMessage, buildWhatsAppUrl } from "./whatsapp-message";

const lines: ResolvedLine[] = [
  {
    product: { id: "a", categoryId: "c", name: "CARVÃO FUMAX 1KG", description: "", priceCents: 4999, image: "" },
    quantity: 2,
    subtotalCents: 9998,
  },
];

const totals = {
  itemCount: 2,
  itemsCents: 9998,
  deliveryFeeCents: 750,
  totalCents: 10748,
  missingForMinimumCents: 0,
};

describe("buildOrderMessage", () => {
  it("lists items, totals, delivery address and payment", () => {
    const message = buildOrderMessage(lines, totals, {
      name: "Ana",
      service: "delivery",
      address: "Rua X, 10",
      addressComplement: "Apto 2",
      payment: "cash",
      changeFor: "R$ 150",
      notes: "Tocar o interfone",
    });

    expect(message.startsWith("Olá! Quero fazer um pedido:\n\n")).toBe(true);
    expect(message).not.toMatch(/[\u{10000}-\u{10FFFF}]/u);
    expect(message).toContain("• 2x CARVÃO FUMAX 1KG — R$ 99,98");
    expect(message).toContain("Entrega: R$ 7,50");
    expect(message).toContain("*Total: R$ 107,48*");
    expect(message).toContain("*Endereço:* Rua X, 10");
    expect(message).toContain("*Complemento:* Apto 2");
    expect(message).toContain("*Pagamento:* Dinheiro (troco para R$ 150)");
    expect(message).toContain("*Observações:* Tocar o interfone");
  });

  it("omits address and fee lines for pickup", () => {
    const message = buildOrderMessage(
      lines,
      { ...totals, deliveryFeeCents: 0, totalCents: 9998 },
      { name: "Ana", service: "pickup", address: "ignorado", payment: "pix" },
    );

    expect(message).toContain("*Tipo:* Retirada na loja");
    expect(message).not.toContain("Endereço");
    expect(message).not.toContain("Entrega:");
  });
});

describe("buildWhatsAppUrl", () => {
  it("encodes the message for wa.me", () => {
    expect(buildWhatsAppUrl("+55 (11) 94559-0209", "Olá & tchau")).toBe(
      "https://wa.me/5511945590209?text=Ol%C3%A1%20%26%20tchau",
    );
  });
});
