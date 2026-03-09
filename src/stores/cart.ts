import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import type { CartItem, OrderType } from "@/lib/shared/types";
import { TAX_RATE } from "@/lib/shared/constants";

interface CartState {
  items: CartItem[];
  orderType: OrderType;
  deliveryFeeCents: number;

  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  setOrderType: (type: OrderType) => void;
  setDeliveryFee: (cents: number) => void;

  subtotalCents: () => number;
  taxCents: () => number;
  totalCents: () => number;
  itemCount: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      orderType: "pickup",
      deliveryFeeCents: 0,

      addItem: (item) => {
        const existing = get().items.find(
          (i) =>
            i.menu_item_id === item.menu_item_id &&
            i.variant === item.variant &&
            i.notes === item.notes
        );

        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === existing.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, { ...item, id: nanoid() }] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        });
      },

      clear: () => set({ items: [], deliveryFeeCents: 0 }),

      setOrderType: (type) => {
        set({ orderType: type });
        if (type === "pickup") set({ deliveryFeeCents: 0 });
      },

      setDeliveryFee: (cents) => set({ deliveryFeeCents: cents }),

      subtotalCents: () =>
        get().items.reduce((sum, i) => sum + i.price_cents * i.quantity, 0),

      taxCents: () => Math.round(get().subtotalCents() * TAX_RATE),

      totalCents: () =>
        get().subtotalCents() + get().taxCents() + get().deliveryFeeCents,

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "jch-cart" }
  )
);
