"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { MenuCategory } from "@/lib/shared/types";
import { cn } from "@/lib/utils";

interface MenuCategoryTabsProps {
  categories: MenuCategory[];
  activeId: string | null;
  onSelect: (id: string | null) => void;
}

export function MenuCategoryTabs({ categories, activeId, onSelect }: MenuCategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
  };

  return (
    <div className="relative flex items-center gap-2">
      <button
        onClick={() => scroll("left")}
        className="hidden md:flex shrink-0 items-center justify-center w-8 h-8 rounded-full bg-white/80 border border-border shadow-sm hover:bg-white transition-colors"
        aria-label="Scroll left"
      >
        <ChevronLeft size={16} />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-1"
      >
        <button
          onClick={() => onSelect(null)}
          className={cn(
            "shrink-0 snap-start rounded-full px-4 py-2 text-sm font-medium transition-all",
            activeId === null
              ? "bg-brand-red text-white shadow-md"
              : "bg-white text-foreground border border-border hover:border-brand-red/30"
          )}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={cn(
              "shrink-0 snap-start rounded-full px-4 py-2 text-sm font-medium transition-all whitespace-nowrap",
              activeId === cat.id
                ? "bg-brand-red text-white shadow-md"
                : "bg-white text-foreground border border-border hover:border-brand-red/30"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <button
        onClick={() => scroll("right")}
        className="hidden md:flex shrink-0 items-center justify-center w-8 h-8 rounded-full bg-white/80 border border-border shadow-sm hover:bg-white transition-colors"
        aria-label="Scroll right"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
