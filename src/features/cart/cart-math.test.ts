import { describe, expect, it } from "vitest";
import type { Product, StoreInfo } from "@/lib/catalog/types";
import { discountPercent, formatBRL } from "@/lib/money";
import { calculateTotals, resolveLines } from "./cart-math";

const product = (id: string, priceCents: number): Product => ({
  id,
  categoryId: "test",
  name: id.toUpperCase(),
  description: "",
  priceCents,
  image: "",
});

const productsById = new Map([
  ["carvao", product("carvao", 2999)],
  ["essencia", product("essencia", 1300)],
]);

const services: StoreInfo["services"] = {
  delivery: { enabled: true, minimumOrderCents: 2000, feeCents: 750 },
  pickup: { enabled: true },
  dineIn: { enabled: true },
};

describe("resolveLines", () => {
  it("drops unknown products and empty quantities", () => {
    const lines = resolveLines(
      [
        { productId: "carvao", quantity: 2 },
        { productId: "sumiu", quantity: 1 },
        { productId: "essencia", quantity: 0 },
      ],
      productsById,
    );
    expect(lines).toHaveLength(1);
    expect(lines[0].subtotalCents).toBe(5998);
  });
});

describe("calculateTotals", () => {
  it("adds the delivery fee for delivery orders", () => {
    const lines = resolveLines([{ productId: "carvao", quantity: 1 }], productsById);
    expect(calculateTotals(lines, "delivery", services)).toEqual({
      itemCount: 1,
      itemsCents: 2999,
      deliveryFeeCents: 750,
      totalCents: 3749,
      missingForMinimumCents: 0,
    });
  });

  it("reports how much is missing for the delivery minimum", () => {
    const lines = resolveLines([{ productId: "essencia", quantity: 1 }], productsById);
    expect(calculateTotals(lines, "delivery", services).missingForMinimumCents).toBe(700);
  });

  it("charges no fee and has no minimum for pickup", () => {
    const lines = resolveLines([{ productId: "essencia", quantity: 1 }], productsById);
    const totals = calculateTotals(lines, "pickup", services);
    expect(totals.deliveryFeeCents).toBe(0);
    expect(totals.missingForMinimumCents).toBe(0);
    expect(totals.totalCents).toBe(1300);
  });
});

describe("money", () => {
  it("formats cents as BRL", () => {
    expect(formatBRL(420000)).toBe("R$ 4.200,00");
  });

  it("computes the discount badge like the old menu", () => {
    expect(discountPercent(2999, 4000)).toBe(25);
    expect(discountPercent(1300)).toBeNull();
  });
});
