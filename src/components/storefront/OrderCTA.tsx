"use client";

import { motion } from "framer-motion";
import { Phone, Truck, ExternalLink } from "lucide-react";
import { brand } from "@/config/brand";

export function OrderCTA() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 bg-black/40" />

      {/* Decorative accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-[10%] right-[5%] text-7xl opacity-10"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          🍗
        </motion.div>
        <motion.div
          className="absolute bottom-[10%] left-[5%] text-6xl opacity-10"
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          🔥
        </motion.div>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-5 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white">
            Ready to <span className="text-brand-gold">Order?</span>
          </h2>
          <p className="mt-4 text-lg text-white/70 max-w-xl mx-auto">
            Pick up in store, get it delivered, or order through your favorite app.
            Hot, fresh, and ready for you.
          </p>
        </motion.div>

        {/* Order Options */}
        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Call to order */}
          <a
            href={brand.phoneHref}
            className="btn-gold rounded-full px-8 py-4 text-base font-bold inline-flex items-center gap-2 min-w-[200px] justify-center"
          >
            <Phone size={18} />
            Call to Order
          </a>

          {/* Pickup */}
          <a
            href="/order"
            className="rounded-full px-8 py-4 text-base font-bold text-white border-2 border-white/30 hover:bg-white/10 transition-colors inline-flex items-center gap-2 min-w-[200px] justify-center"
          >
            <Truck size={18} />
            Pickup Order
          </a>
        </motion.div>

        {/* Third-party delivery */}
        <motion.div
          className="mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-white/50 text-sm mb-4 uppercase tracking-wider font-medium">
            Also available on
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {brand.thirdParty.doordash && (
              <a
                href={brand.thirdParty.doordash}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-6 py-3 text-white font-semibold text-sm hover:bg-white/20 transition-colors"
              >
                DoorDash
                <ExternalLink size={14} />
              </a>
            )}
            {brand.thirdParty.grubhub && (
              <a
                href={brand.thirdParty.grubhub}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-6 py-3 text-white font-semibold text-sm hover:bg-white/20 transition-colors"
              >
                Grubhub
                <ExternalLink size={14} />
              </a>
            )}
            {brand.thirdParty.yelp && (
              <a
                href={brand.thirdParty.yelp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-6 py-3 text-white font-semibold text-sm hover:bg-white/20 transition-colors"
              >
                Yelp
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </motion.div>

        {/* Phone number display */}
        <motion.p
          className="mt-8 text-white/40 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          Call us directly at{" "}
          <a href={brand.phoneHref} className="text-brand-gold hover:underline">
            {brand.phone}
          </a>
        </motion.p>
      </div>
    </section>
  );
}
