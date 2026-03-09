"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { brand } from "@/config/brand";
import { cn } from "@/lib/utils";

export function StorefrontNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-brand-cream/95 backdrop-blur-md shadow-md"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8">
        {/* Logo / Brand Name */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.jpg"
            alt="Jus Chick-Hen"
            width={56}
            height={56}
            className="rounded-full ring-2 ring-brand-gold/60 shadow-md object-cover"
            priority
          />
          <span className={cn(
            "font-display text-xl font-bold tracking-tight transition-colors hidden sm:inline",
            scrolled ? "text-brand-red" : "text-white"
          )}>
            Jus Chick-Hen
          </span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center gap-8">
          {brand.nav.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  scrolled
                    ? "text-brand-brown/70 hover:text-brand-red"
                    : "text-white/80 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Right: Phone + CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <a
            href={brand.phoneHref}
            className={cn(
              "flex items-center gap-1.5 text-sm font-medium transition-colors",
              scrolled ? "text-brand-brown/70" : "text-white/80"
            )}
          >
            <Phone size={14} />
            {brand.phone}
          </a>
          <Link
            href="/order"
            className="btn-cta rounded-full px-6 py-2.5 text-sm font-bold text-white"
          >
            Order Now
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={cn(
            "lg:hidden p-2 rounded-lg transition-colors",
            scrolled ? "text-brand-brown" : "text-white"
          )}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden bg-brand-cream/98 backdrop-blur-lg border-t border-brand-gold/20"
          >
            <nav className="flex flex-col gap-1 px-5 py-4">
              {brand.nav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-lg font-medium text-brand-brown py-3 border-b border-brand-gold/10 transition-colors hover:text-brand-red"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={brand.phoneHref}
                className="flex items-center gap-2 text-lg font-medium text-brand-brown py-3 border-b border-brand-gold/10"
              >
                <Phone size={18} />
                {brand.phone}
              </a>
              <Link
                href="/order"
                onClick={() => setMobileOpen(false)}
                className="btn-cta mt-3 rounded-full px-6 py-3.5 text-center text-base font-bold text-white"
              >
                Order Now
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
