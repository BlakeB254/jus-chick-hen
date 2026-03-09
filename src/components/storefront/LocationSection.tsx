"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Navigation } from "lucide-react";
import { brand } from "@/config/brand";

export function LocationSection() {
  const { address, phone, hours } = brand;
  const fullAddress = brand.fullAddress;
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`;

  return (
    <section id="location" className="py-20 md:py-28 bg-brand-warm">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-brand-red font-semibold text-sm uppercase tracking-wider">
            Come Visit
          </span>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl md:text-6xl font-bold text-brand-brown">
            Find <span className="text-gradient-brand">Us</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Info Column */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            {/* Address */}
            <div className="flex gap-4">
              <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-brand-red/10 text-brand-red">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-brand-brown">Address</h3>
                <p className="mt-1 text-brand-brown/70">{address.street}</p>
                <p className="text-brand-brown/70">
                  {address.city}, {address.state} {address.zip}
                </p>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-2 text-brand-red font-semibold text-sm hover:underline"
                >
                  <Navigation size={14} />
                  Get Directions
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-4">
              <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-brand-red/10 text-brand-red">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-brand-brown">Call Us</h3>
                <a
                  href={brand.phoneHref}
                  className="mt-1 text-lg text-brand-brown/70 hover:text-brand-red transition-colors"
                >
                  {phone}
                </a>
              </div>
            </div>

            {/* Hours */}
            <div className="flex gap-4">
              <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-brand-red/10 text-brand-red">
                <Clock size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg font-bold text-brand-brown">Hours</h3>
                <div className="mt-2 space-y-1.5">
                  {hours.map((h) => (
                    <div
                      key={h.day}
                      className="flex justify-between text-sm text-brand-brown/70 border-b border-brand-gold/10 pb-1.5 last:border-0"
                    >
                      <span className="font-medium">{h.day}</span>
                      <span>
                        {h.open} &ndash; {h.close}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Map Embed */}
          <motion.div
            className="rounded-2xl overflow-hidden bg-white shadow-lg min-h-[350px] flex flex-col"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex-1 min-h-[300px]">
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=-87.7198%2C41.8534%2C-87.7098%2C41.8634&layer=mapnik&marker=41.8584%2C-87.7148"
                width="100%"
                height="100%"
                loading="lazy"
                className="rounded-xl"
                allowFullScreen
                title="Jus Chick-Hen location map"
              />
            </div>
            <div className="p-4 text-center">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${address.lat},${address.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 btn-cta rounded-full px-6 py-2.5 text-sm font-bold text-white"
              >
                <Navigation size={16} />
                Get Directions
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
