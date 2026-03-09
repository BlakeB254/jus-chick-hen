"use client";

import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/stores/cart";
import { formatPrice } from "@/lib/format";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const items = useCart((s) => s.items);
  const removeItem = useCart((s) => s.removeItem);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const subtotalCents = useCart((s) => s.subtotalCents);
  const itemCount = useCart((s) => s.itemCount);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white shadow-2xl animate-slide-in-right flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-brand-red" />
            <h2 className="text-lg font-bold">Your Order</h2>
            <span className="rounded-full bg-brand-red px-2 py-0.5 text-xs font-bold text-white">
              {itemCount()}
            </span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={48} className="text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground font-medium">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mt-1">Add some delicious items from our menu!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 pb-4 border-b border-border/50 last:border-0">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground truncate">{item.name}</h4>
                    {item.variant && (
                      <p className="text-xs text-muted-foreground">{item.variant}</p>
                    )}
                    {item.notes && (
                      <p className="text-xs text-muted-foreground italic mt-0.5">{item.notes}</p>
                    )}
                    <p className="text-sm font-semibold text-brand-red mt-1">
                      {formatPrice(item.price_cents * item.quantity)}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="flex items-center gap-2 rounded-full border border-border px-1.5 py-0.5">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-muted"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-muted"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border px-5 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">{formatPrice(subtotalCents())}</span>
            </div>
            <p className="text-xs text-muted-foreground">Tax calculated at checkout</p>
            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full btn-cta rounded-full py-3 text-center font-semibold text-white"
            >
              Checkout — {formatPrice(subtotalCents())}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
