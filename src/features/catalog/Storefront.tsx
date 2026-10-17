"use client";

import { useEffect, useMemo, useState } from "react";
import { CartBar } from "@/features/cart/CartBar";
import { calculateTotals, resolveLines } from "@/features/cart/cart-math";
import { useCartStore } from "@/features/cart/cart-store";
import { CheckoutSheet } from "@/features/checkout/CheckoutSheet";
import type { CategoryWithProducts, Product, StoreInfo } from "@/lib/catalog/types";
import { CategoryTabs, sectionDomId } from "./CategoryTabs";
import { ProductCard } from "./ProductCard";
import { ProductSheet } from "./ProductSheet";

type StorefrontProps = {
  catalog: CategoryWithProducts[];
  store: StoreInfo;
};

const normalize = (text: string) =>
  text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function Storefront({ catalog, store }: StorefrontProps) {
  const [query, setQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const cartLines = useCartStore((state) => state.lines);
  const addToCart = useCartStore((state) => state.add);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const clearCart = useCartStore((state) => state.clear);

  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  const productsById = useMemo(
    () => new Map(catalog.flatMap((category) => category.products).map((product) => [product.id, product])),
    [catalog],
  );
  const resolvedLines = useMemo(() => resolveLines(cartLines, productsById), [cartLines, productsById]);
  const cartSummary = calculateTotals(resolvedLines, "pickup", store.services);
  const quantityById = new Map(cartLines.map((line) => [line.productId, line.quantity]));

  const visibleCatalog = useMemo(() => {
    const needle = normalize(query.trim());
    if (!needle) return catalog;
    return catalog
      .map((category) => ({
        ...category,
        products: category.products.filter((product) =>
          normalize(`${product.name} ${product.description}`).includes(needle),
        ),
      }))
      .filter((category) => category.products.length > 0);
  }, [catalog, query]);

  return (
    <>
      <CategoryTabs categories={catalog} query={query} onQueryChange={setQuery} />

      <main className="mx-auto max-w-6xl px-4 pb-32 pt-6 md:px-8">
        {visibleCatalog.length === 0 && (
          <p className="py-16 text-center text-sm text-muted">Nenhum produto encontrado para “{query}”.</p>
        )}

        {visibleCatalog.map((category, index) => (
          <section key={category.id} id={sectionDomId(category.id)} className="scroll-mt-20 pb-10">
            <div className="mb-4 flex items-baseline gap-3">
              <span className="font-display text-sm text-accent">{String(index + 1).padStart(2, "0")}</span>
              <h2 className="font-display text-4xl leading-none tracking-wide">{category.name}</h2>
              <span className="h-px flex-1 bg-line" />
              <span className="text-xs text-muted">{category.products.length}</span>
            </div>
            <div className="grid gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
              {category.products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  quantityInCart={quantityById.get(product.id) ?? 0}
                  onOpen={setSelectedProduct}
                  onQuickAdd={(item) => addToCart(item.id)}
                />
              ))}
            </div>
          </section>
        ))}
      </main>

      <ProductSheet
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAdd={(product, quantity) => {
          addToCart(product.id, quantity);
          setSelectedProduct(null);
        }}
      />

      <CartBar
        itemCount={cartSummary.itemCount}
        itemsCents={cartSummary.itemsCents}
        onOpen={() => setCheckoutOpen(true)}
      />

      <CheckoutSheet
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        lines={resolvedLines}
        store={store}
        onQuantityChange={setQuantity}
        onClearCart={clearCart}
      />
    </>
  );
}
