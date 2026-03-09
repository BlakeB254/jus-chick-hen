"use client";

import { useState } from "react";
import { X, Minus, Plus } from "lucide-react";
import type { MenuItem } from "@/lib/shared/types";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/stores/cart";
import { useToast } from "@/stores/toast";
import { useEscapeKey } from "@/hooks/useEscapeKey";

interface MenuItemModalProps {
  item: MenuItem;
  onClose: () => void;
}

export function MenuItemModal({ item, onClose }: MenuItemModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const addItem = useCart((s) => s.addItem);
  const addToast = useToast((s) => s.addToast);

  useEscapeKey(onClose);

  const activePrice = selectedVariant
    ? item.variants?.find((v) => v.label === selectedVariant)?.price_cents ?? item.price_cents
    : item.price_cents;

  const handleAdd = () => {
    addItem({
      menu_item_id: item.id,
      name: selectedVariant ? `${item.name} (${selectedVariant})` : item.name,
      price_cents: activePrice,
      quantity,
      variant: selectedVariant,
      notes: notes.trim() || null,
    });
    addToast(`${item.name} added to cart`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white/90 shadow-md hover:bg-white transition-colors"
        >
          <X size={18} />
        </button>

        {/* Image */}
        {item.image_url && (
          <div className="aspect-video w-full overflow-hidden rounded-t-2xl sm:rounded-t-2xl bg-muted">
            <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
          </div>
        )}

        <div className="p-5">
          <h2 id="modal-title" className="text-xl font-bold text-foreground">{item.name}</h2>
          {item.description && (
            <p className="mt-1 text-muted-foreground">{item.description}</p>
          )}
          <p className="mt-2 text-2xl font-bold text-brand-red">{formatPrice(activePrice)}</p>

          {/* Variants */}
          {item.variants && item.variants.length > 0 && (
            <div className="mt-4">
              <label className="text-sm font-medium text-foreground">Size / Option</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {item.variants.map((v) => (
                  <button
                    key={v.label}
                    onClick={() => setSelectedVariant(v.label === selectedVariant ? null : v.label)}
                    className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-all ${
                      selectedVariant === v.label
                        ? "border-brand-red bg-brand-red/10 text-brand-red"
                        : "border-border text-foreground hover:border-brand-red/30"
                    }`}
                  >
                    {v.label} — {formatPrice(v.price_cents)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Special instructions */}
          <div className="mt-4">
            <label htmlFor="notes" className="text-sm font-medium text-foreground">
              Special Instructions
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. extra sauce, no onions..."
              maxLength={200}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-brand-red focus:ring-1 focus:ring-brand-red/20 outline-none resize-none"
              rows={2}
            />
            <p className="text-xs text-muted-foreground text-right">{notes.length}/200</p>
          </div>

          {/* Quantity + Add to cart */}
          <div className="mt-5 flex items-center gap-4">
            <div className="flex items-center gap-3 rounded-full border border-border px-2 py-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-muted transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="w-6 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-muted transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>

            <button
              onClick={handleAdd}
              className="flex-1 btn-cta rounded-full py-3 text-center font-semibold text-white"
            >
              Add to Order — {formatPrice(activePrice * quantity)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
