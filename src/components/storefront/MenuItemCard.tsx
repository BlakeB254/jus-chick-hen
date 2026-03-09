"use client";

import { Plus, Star } from "lucide-react";
import type { MenuItem } from "@/lib/shared/types";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/stores/cart";
import { useToast } from "@/stores/toast";
import { cn } from "@/lib/utils";

interface MenuItemCardProps {
  item: MenuItem;
  onViewDetails?: (item: MenuItem) => void;
}

export function MenuItemCard({ item, onViewDetails }: MenuItemCardProps) {
  const addItem = useCart((s) => s.addItem);
  const addToast = useToast((s) => s.addToast);

  const handleAdd = () => {
    addItem({
      menu_item_id: item.id,
      name: item.name,
      price_cents: item.price_cents,
      quantity: 1,
      variant: null,
      notes: null,
    });
    addToast(`${item.name} added to cart`);
  };

  return (
    <div
      className={cn(
        "food-card group relative flex flex-col rounded-xl bg-white p-4 cursor-pointer",
        item.is_featured && "ring-2 ring-brand-gold/40"
      )}
      onClick={() => onViewDetails?.(item)}
    >
      {item.is_featured && (
        <div className="absolute -top-2 -right-2 flex items-center gap-1 rounded-full bg-brand-gold px-2.5 py-0.5 text-xs font-bold text-brand-brown">
          <Star size={12} fill="currentColor" />
          Popular
        </div>
      )}

      {item.image_url && (
        <div className="mb-3 aspect-[4/3] overflow-hidden rounded-lg bg-muted">
          <img
            src={item.image_url}
            alt={item.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col">
        <h3 className="font-semibold text-foreground leading-tight">{item.name}</h3>
        {item.description && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{item.description}</p>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-lg font-bold text-brand-red">
          {item.price_cents === 0 ? "Free" : formatPrice(item.price_cents)}
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAdd();
          }}
          className="flex items-center gap-1.5 rounded-full bg-brand-red px-3 py-1.5 text-sm font-medium text-white transition-all hover:bg-brand-red-dark active:scale-95"
        >
          <Plus size={14} />
          Add
        </button>
      </div>
    </div>
  );
}
