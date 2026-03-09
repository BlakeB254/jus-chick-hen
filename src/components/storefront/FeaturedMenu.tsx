"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Flame } from "lucide-react";
import { MenuItemCard } from "@/components/storefront/MenuItemCard";
import { MenuItemModal } from "@/components/storefront/MenuItemModal";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import type { MenuGrouped, MenuItem } from "@/lib/shared/types";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function FeaturedMenu() {
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchMenu = () => {
    setLoading(true);
    setError(false);
    fetch("/api/menu")
      .then((res) => res.json())
      .then((data: MenuGrouped[]) => {
        const featured = data
          .flatMap((g) => g.items)
          .filter((item) => item.is_featured);
        setFeaturedItems(featured);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  if (!loading && !error && featuredItems.length === 0) return null;

  return (
    <>
      <section id="menu" className="py-20 md:py-28 bg-brand-cream">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          {/* Section Header */}
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-1.5 text-brand-red font-semibold text-sm uppercase tracking-wider mb-3">
              <Flame size={16} />
              Our Menu
            </span>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-brand-brown">
              Featured <span className="text-gradient-brand">Favorites</span>
            </h2>
            <p className="mt-4 text-lg text-brand-brown/60 max-w-xl mx-auto">
              From our signature hot honey chicken to creative eggrolls &mdash; every bite hits different.
            </p>
          </motion.div>

          {/* Menu Grid — uses the same MenuItemCard as /menu */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-white p-4 animate-pulse">
                  <div className="aspect-[4/3] bg-muted rounded-xl mb-4" />
                  <div className="h-5 bg-muted rounded w-3/4 mb-3" />
                  <div className="h-3 bg-muted rounded w-full mb-2" />
                  <div className="h-3 bg-muted rounded w-2/3 mb-4" />
                  <div className="h-5 bg-muted rounded w-16" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-brand-brown/60 mb-4">Couldn&apos;t load menu</p>
              <button
                onClick={fetchMenu}
                className="inline-flex items-center gap-2 rounded-full bg-brand-red px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-red/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              {featuredItems.map((item) => (
                <motion.div key={item.id} variants={itemVariants}>
                  <MenuItemCard item={item} onViewDetails={setSelectedItem} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* View Full Menu Link */}
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 text-brand-red font-bold text-lg hover:gap-3 transition-all duration-200"
            >
              View Full Menu
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Shared modal + cart drawer */}
      {selectedItem && (
        <MenuItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
