import Image from "next/image";
import { PlusIcon } from "@/components/ui/icons";
import type { Product } from "@/lib/catalog/types";
import { discountPercent, formatBRL } from "@/lib/money";

type ProductCardProps = {
  product: Product;
  quantityInCart: number;
  onOpen: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
};

export function ProductCard({ product, quantityInCart, onOpen, onQuickAdd }: ProductCardProps) {
  const discount = discountPercent(product.priceCents, product.compareAtCents);

  return (
    <article className="group relative flex gap-3 rounded-xl border border-line bg-surface p-3 transition hover:border-line-strong md:flex-col-reverse md:gap-0 md:p-0">
      <button
        type="button"
        onClick={() => onOpen(product)}
        className="flex min-w-0 flex-1 flex-col text-left after:absolute after:inset-0 after:content-[''] md:p-4"
      >
        <h3 className="line-clamp-2 text-sm font-semibold uppercase leading-snug tracking-wide">{product.name}</h3>
        {product.description && (
          <p className="mt-1 line-clamp-2 whitespace-pre-line text-xs leading-relaxed text-muted">
            {product.description}
          </p>
        )}
        <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-3">
          {discount && (
            <span className="rounded bg-accent px-1.5 py-0.5 text-[0.65rem] font-bold text-white">-{discount}%</span>
          )}
          <span className="text-base font-semibold">{formatBRL(product.priceCents)}</span>
          {product.compareAtCents && (
            <span className="text-xs text-muted line-through">{formatBRL(product.compareAtCents)}</span>
          )}
        </div>
      </button>

      <div className="relative size-28 shrink-0 overflow-hidden rounded-lg bg-surface-2 md:aspect-square md:size-auto md:rounded-b-none md:rounded-t-xl">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 768px) 33vw, 112px"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        {quantityInCart > 0 && (
          <span className="absolute left-1.5 top-1.5 z-10 grid min-w-6 place-items-center rounded-full bg-accent px-1.5 py-0.5 text-[0.7rem] font-bold text-white">
            {quantityInCart}
          </span>
        )}
        <button
          type="button"
          onClick={() => onQuickAdd(product)}
          aria-label={`Adicionar ${product.name} ao carrinho`}
          className="absolute bottom-1.5 right-1.5 z-10 grid size-10 place-items-center rounded-full bg-fg text-xl text-bg shadow-lg transition hover:bg-accent hover:text-white active:scale-90"
        >
          <PlusIcon />
        </button>
      </div>
    </article>
  );
}
