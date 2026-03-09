"use client";

import { useState, useEffect, useMemo } from "react";
import { ShoppingBag, Search } from "lucide-react";
import { MenuCategoryTabs } from "@/components/storefront/MenuCategoryTabs";
import { MenuItemCard } from "@/components/storefront/MenuItemCard";
import { MenuItemModal } from "@/components/storefront/MenuItemModal";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { useCart } from "@/stores/cart";
import type { MenuGrouped, MenuItem } from "@/lib/shared/types";

export function MenuPageClient() {
  const [menu, setMenu] = useState<MenuGrouped[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const itemCount = useCart((s) => s.itemCount);

  useEffect(() => {
    fetch("/api/menu")
      .then((res) => res.json())
      .then((data) => {
        setMenu(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = useMemo(() => menu.map((g) => g.category), [menu]);

  const filteredGroups = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return menu
      .filter((g) => !activeCategory || g.category.id === activeCategory)
      .map((g) => ({
        ...g,
        items: g.items.filter((item) =>
          !query || item.name.toLowerCase().includes(query)
        ),
      }))
      .filter((g) => g.items.length > 0);
  }, [menu, activeCategory, searchQuery]);

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-white border-b border-border sticky top-0 z-40">
          <div className="mx-auto max-w-6xl px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-2xl font-bold text-foreground">Our Menu</h1>
              <button
                onClick={() => setCartOpen(true)}
                className="relative flex items-center gap-2 rounded-full bg-brand-red px-4 py-2 text-sm font-medium text-white transition-all hover:bg-brand-red-dark"
              >
                <ShoppingBag size={16} />
                Cart
                {(() => {
                  const count = itemCount();
                  return count > 0 ? (
                    <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-5 h-5 rounded-full bg-brand-gold text-brand-brown text-xs font-bold">
                      {count}
                    </span>
                  ) : null;
                })()}
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search menu..."
                className="w-full rounded-full border border-border bg-background pl-9 pr-4 py-2 text-sm placeholder:text-muted-foreground focus:border-brand-red focus:ring-1 focus:ring-brand-red/20 outline-none"
              />
            </div>

            {/* Category tabs */}
            <MenuCategoryTabs
              categories={categories}
              activeId={activeCategory}
              onSelect={setActiveCategory}
            />
          </div>
        </div>

        {/* Menu grid */}
        <div className="mx-auto max-w-6xl px-4 py-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="rounded-xl bg-white border border-border p-4 animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-3" />
                  <div className="h-3 bg-muted rounded w-1/2 mb-4" />
                  <div className="flex justify-between items-center">
                    <div className="h-5 bg-muted rounded w-16" />
                    <div className="h-8 bg-muted rounded-full w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredGroups.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No items found</p>
              <p className="text-sm text-muted-foreground mt-1">Try a different search or category</p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredGroups.map((group) => (
                <section key={group.category.id}>
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-foreground">{group.category.name}</h2>
                    {group.category.description && (
                      <p className="text-sm text-muted-foreground">{group.category.description}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {group.items.map((item) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        onViewDetails={setSelectedItem}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Item detail modal */}
      {selectedItem && (
        <MenuItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}

      {/* Cart drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
