import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartLine } from "./cart-math";

const MAX_QUANTITY_PER_ITEM = 99;

type CartState = {
  lines: CartLine[];
  add: (productId: string, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
};

const clampQuantity = (quantity: number) => Math.min(Math.max(Math.floor(quantity), 0), MAX_QUANTITY_PER_ITEM);

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      add: (productId, quantity = 1) =>
        set((state) => {
          const existing = state.lines.find((line) => line.productId === productId);
          if (!existing) {
            return { lines: [...state.lines, { productId, quantity: clampQuantity(quantity) }] };
          }
          return {
            lines: state.lines.map((line) =>
              line.productId === productId
                ? { ...line, quantity: clampQuantity(line.quantity + quantity) }
                : line,
            ),
          };
        }),
      setQuantity: (productId, quantity) =>
        set((state) => ({
          lines: state.lines
            .map((line) => (line.productId === productId ? { ...line, quantity: clampQuantity(quantity) } : line))
            .filter((line) => line.quantity > 0),
        })),
      clear: () => set({ lines: [] }),
    }),
    {
      name: "trinity:cart",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);
