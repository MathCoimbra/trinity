import { ArrowRightIcon, BagIcon } from "@/components/ui/icons";
import { formatBRL } from "@/lib/money";

type CartBarProps = {
  itemCount: number;
  itemsCents: number;
  onOpen: () => void;
};

export function CartBar({ itemCount, itemsCents, onOpen }: CartBarProps) {
  if (itemCount === 0) return null;

  return (
    <div className="pb-safe pointer-events-none fixed inset-x-0 bottom-0 z-40 bg-linear-to-t from-bg via-bg/80 to-transparent px-4 pt-6">
      <button
        type="button"
        onClick={onOpen}
        className="pointer-events-auto mx-auto flex h-14 w-full max-w-lg items-center gap-3 rounded-full bg-accent pl-2 pr-5 text-white shadow-2xl shadow-accent/30 transition hover:brightness-110 active:scale-[0.98]"
      >
        <span className="relative grid size-10 place-items-center rounded-full bg-black/25 text-xl">
          <BagIcon />
          <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-white px-1 text-[0.65rem] font-bold text-accent">
            {itemCount}
          </span>
        </span>
        <span className="flex-1 text-left text-sm font-semibold uppercase tracking-wide">Ver carrinho</span>
        <span className="text-sm font-semibold tabular-nums">{formatBRL(itemsCents)}</span>
        <ArrowRightIcon className="text-lg" />
      </button>
    </div>
  );
}
