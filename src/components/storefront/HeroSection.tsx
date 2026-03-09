"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 hero-overlay" />

      {/* Decorative floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-[15%] left-[10%] text-6xl opacity-20"
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          🍗
        </motion.div>
        <motion.div
          className="absolute top-[25%] right-[15%] text-5xl opacity-15"
          animate={{ y: [0, 15, 0], rotate: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          🔥
        </motion.div>
        <motion.div
          className="absolute bottom-[30%] left-[20%] text-4xl opacity-15"
          animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          🍯
        </motion.div>
        <motion.div
          className="absolute bottom-[20%] right-[10%] text-5xl opacity-20"
          animate={{ y: [0, 18, 0], rotate: [0, -12, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          🐔
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-5 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-brand-gold/20 text-brand-gold text-sm font-semibold tracking-wide uppercase">
            Chicago&apos;s North Lawndale Favorite
          </span>
        </motion.div>

        <motion.h1
          className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white leading-[0.9] tracking-tight"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
        >
          Jus{" "}
          <span className="text-brand-gold">Chick-Hen</span>
        </motion.h1>

        <motion.p
          className="mt-6 text-lg sm:text-xl md:text-2xl text-white/80 font-medium max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          Home of the{" "}
          <span className="text-brand-gold font-bold">Hot Honey Chicken</span>
          {" "}&amp;{" "}
          <span className="text-brand-gold font-bold">Hot Honey Catfish</span>
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
        >
          <Link
            href="/order"
            className="btn-cta rounded-full px-10 py-4 text-lg font-bold text-white min-w-[200px] text-center animate-pulse-glow"
          >
            Order Now
          </Link>
          <Link
            href="/menu"
            className="btn-gold rounded-full px-10 py-4 text-lg font-bold min-w-[200px] text-center"
          >
            View Menu
          </Link>
        </motion.div>

        <motion.p
          className="mt-6 text-white/50 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          Takeout &bull; Delivery &bull; DoorDash &bull; Grubhub
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown size={28} />
      </motion.div>
    </section>
  );
}
