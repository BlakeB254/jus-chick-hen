"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight, Flame } from "lucide-react";

interface MenuItem {
  name: string;
  price: string;
  description: string;
  badge?: string;
}

const featuredItems: MenuItem[] = [
  {
    name: "Hot Honey Chicken (3pc)",
    price: "$10.99",
    description: "Crispy fried chicken drizzled with our signature hot honey sauce. Three pieces of perfection.",
    badge: "Signature",
  },
  {
    name: "Hot Honey Chicken (5pc)",
    price: "$15.99",
    description: "Our famous hot honey chicken — five golden crispy pieces with that sweet heat you crave.",
    badge: "Best Seller",
  },
  {
    name: "Hot Honey Catfish Dinner",
    price: "$14.99",
    description: "Flaky catfish fillets with hot honey glaze, served with fries and coleslaw.",
    badge: "Signature",
  },
  {
    name: "Whole Chick-Hen Wings (6pc)",
    price: "$8.99",
    description: "Six jumbo whole wings tossed in your choice of sauce. Classic Chicago style.",
  },
  {
    name: "Jus Chick-Hen Sandwich",
    price: "$9.99",
    description: "Crispy chicken breast on a toasted bun with pickles, slaw, and hot honey drizzle.",
    badge: "Fan Favorite",
  },
  {
    name: "Alfredo Eggroll",
    price: "$5.99",
    description: "Creamy chicken alfredo wrapped in a crispy eggroll shell. A Jus Chick-Hen original.",
    badge: "Unique",
  },
];

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
  return (
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

        {/* Menu Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {featuredItems.map((item) => (
            <motion.div
              key={item.name}
              className="food-card bg-white rounded-2xl p-6 flex flex-col"
              variants={itemVariants}
            >
              {/* Badge */}
              {item.badge && (
                <span className="self-start inline-block mb-3 px-3 py-1 rounded-full bg-brand-red/10 text-brand-red text-xs font-bold uppercase tracking-wide">
                  {item.badge}
                </span>
              )}

              {/* Name & Price */}
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-xl font-bold text-brand-brown leading-tight">
                  {item.name}
                </h3>
                <span className="shrink-0 font-display text-xl font-bold text-brand-red">
                  {item.price}
                </span>
              </div>

              {/* Description */}
              <p className="mt-3 text-sm text-brand-brown/60 leading-relaxed flex-1">
                {item.description}
              </p>

              {/* Order Button */}
              <button className="mt-5 flex items-center justify-center gap-2 w-full rounded-xl bg-brand-warm hover:bg-brand-gold/20 text-brand-brown font-semibold text-sm py-3 transition-all duration-200 hover:shadow-md">
                <ShoppingBag size={16} />
                Order This
              </button>
            </motion.div>
          ))}
        </motion.div>

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
  );
}
