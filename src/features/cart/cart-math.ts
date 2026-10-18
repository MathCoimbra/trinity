import type { Product, ServiceType, StoreInfo } from "@/lib/catalog/types";

export type CartLine = {
  productId: string;
  quantity: number;
};

export type ResolvedLine = {
  product: Product;
  quantity: number;
  subtotalCents: number;
};

export type CartTotals = {
  itemCount: number;
  itemsCents: number;
  deliveryFeeCents: number;
  totalCents: number;
  missingForMinimumCents: number;
};

export function resolveLines(lines: CartLine[], productsById: Map<string, Product>): ResolvedLine[] {
  return lines.flatMap((line) => {
    const product = productsById.get(line.productId);
    if (!product || line.quantity <= 0) return [];
    return [{ product, quantity: line.quantity, subtotalCents: product.priceCents * line.quantity }];
  });
}

export function calculateTotals(
  lines: ResolvedLine[],
  service: ServiceType,
  services: StoreInfo["services"],
): CartTotals {
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const itemsCents = lines.reduce((sum, line) => sum + line.subtotalCents, 0);
  const isDelivery = service === "delivery";
  const deliveryFeeCents = isDelivery && itemCount > 0 ? services.delivery.feeCents : 0;
  const missingForMinimumCents = isDelivery
    ? Math.max(services.delivery.minimumOrderCents - itemsCents, 0)
    : 0;

  return {
    itemCount,
    itemsCents,
    deliveryFeeCents,
    totalCents: itemsCents + deliveryFeeCents,
    missingForMinimumCents,
  };
}
