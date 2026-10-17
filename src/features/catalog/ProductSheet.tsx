"use client";

import Image from "next/image";
import { useState } from "react";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { Sheet } from "@/components/ui/Sheet";
import type { Product } from "@/lib/catalog/types";
import { discountPercent, formatBRL } from "@/lib/money";

type ProductSheetProps = {
  product: Product | null;
  onClose: () => void;
  onAdd: (product: Product, quantity: number) => void;
};

export function ProductSheet({ product, onClose, onAdd }: ProductSheetProps) {
  return (
    <Sheet open={product !== null} onClose={onClose} title="Detalhes" footer={product && <AddFooter key={product.id} product={product} onAdd={onAdd} />}>
      {product && <ProductDetails product={product} />}
    </Sheet>
  );
}

function ProductDetails({ product }: { product: Product }) {
  const discount = discountPercent(product.priceCents, product.compareAtCents);

  return (
    <div>
      <div className="relative aspect-square max-h-[45dvh] w-full bg-surface-2 md:max-h-none">
        <Image src={product.image} alt={product.name} fill sizes="(min-width: 768px) 512px, 100vw" className="object-contain" />
      </div>
      <div className="space-y-3 px-5 py-5">
        <h3 className="font-display text-3xl leading-none tracking-wide">{product.name}</h3>
        <div className="flex items-center gap-2">
          {discount && <span className="rounded bg-accent px-1.5 py-0.5 text-xs font-bold text-white">-{discount}%</span>}
          <span className="text-xl font-semibold">{formatBRL(product.priceCents)}</span>
          {product.compareAtCents && (
            <span className="text-sm text-muted line-through">{formatBRL(product.compareAtCents)}</span>
          )}
        </div>
        {product.description && (
          <p className="whitespace-pre-line text-sm leading-relaxed text-muted">{product.description}</p>
        )}
      </div>
    </div>
  );
}

function AddFooter({ product, onAdd }: { product: Product; onAdd: ProductSheetProps["onAdd"] }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex items-center gap-3">
      <QuantityStepper value={quantity} onChange={setQuantity} min={1} />
      <button
        type="button"
        onClick={() => onAdd(product, quantity)}
        className="flex h-12 flex-1 items-center justify-between rounded-full bg-accent px-5 text-sm font-semibold uppercase tracking-wide text-white transition hover:brightness-110 active:scale-[0.98]"
      >
        <span>Adicionar</span>
        <span className="tabular-nums">{formatBRL(product.priceCents * quantity)}</span>
      </button>
    </div>
  );
}
