"use client";

import { motion } from "framer-motion";
import { Heart, Utensils, MapPin } from "lucide-react";

const highlights = [
  {
    icon: Utensils,
    title: "Made Fresh Daily",
    description: "Every piece of chicken is hand-breaded and fried to crispy golden perfection, never frozen.",
  },
  {
    icon: Heart,
    title: "Community First",
    description: "Proudly serving North Lawndale and the West Side of Chicago with food that feels like home.",
  },
  {
    icon: MapPin,
    title: "Chicago Roots",
    description: "Born and raised on the West Side. We bring real Chicago flavor to every plate.",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-28 bg-brand-warm">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-brand-red font-semibold text-sm uppercase tracking-wider">
              Our Story
            </span>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl font-bold text-brand-brown leading-tight">
              More Than Just Chicken
            </h2>
            <div className="mt-6 space-y-4 text-brand-brown/70 text-lg leading-relaxed">
              <p>
                Jus Chick-Hen is a homegrown Chicago restaurant bringing bold
                flavors to the North Lawndale neighborhood. Our signature hot
                honey sauce is what dreams are made of &mdash; sweet, spicy, and
                perfectly balanced on crispy golden chicken.
              </p>
              <p>
                From our famous Hot Honey Chicken to creative dishes like the
                Alfredo Eggroll, we&apos;re not just another chicken spot. We&apos;re a
                movement. Come taste the difference.
              </p>
            </div>
          </motion.div>

          {/* Highlights Grid */}
          <div className="grid gap-6">
            {highlights.map((item, i) => (
              <motion.div
                key={item.title}
                className="flex gap-5 p-6 bg-white rounded-2xl shadow-sm"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-brand-red/10 text-brand-red">
                  <item.icon size={24} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-brand-brown">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-brand-brown/60 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
