import { TrinityMark } from "@/components/ui/TrinityLogo";
import { StoreHeader } from "@/features/catalog/StoreHeader";
import { Storefront } from "@/features/catalog/Storefront";
import { getCatalog, getStoreInfo } from "@/lib/catalog/repository";

export default function HomePage() {
  const store = getStoreInfo();
  const catalog = getCatalog();

  return (
    <>
      <StoreHeader store={store} />
      <Storefront catalog={catalog} store={store} />
      <footer className="border-t border-line px-4 pb-32 pt-10 text-center md:pb-12">
        <TrinityMark className="mx-auto h-8 w-auto opacity-60" />
        <p className="mt-4 text-xs text-muted">
          {store.name} · Venda proibida para menores de 18 anos.
        </p>
      </footer>
    </>
  );
}
