"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { brand } from "@/config/brand";

interface Review {
  id: number;
  name: string;
  text: string;
  rating: number;
  date: string;
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Marcus T.",
    text: "Best chicken on the West Side, no cap. The hot honey chicken is INSANE. Crispy, juicy, and that sauce is addicting. I order at least twice a week.",
    rating: 5,
    date: "2 weeks ago",
  },
  {
    id: 2,
    name: "Shaniqua W.",
    text: "The Alfredo Eggrolls are a game changer! Never had anything like it. And the catfish dinner is absolutely perfect. This is our family's go-to spot.",
    rating: 5,
    date: "1 month ago",
  },
  {
    id: 3,
    name: "Derek J.",
    text: "Ordered the 5-piece hot honey chicken and the wings. Everything came out hot and fresh. The portions are generous and prices are fair. Real deal.",
    rating: 5,
    date: "3 weeks ago",
  },
  {
    id: 4,
    name: "Tiffany M.",
    text: "Finally a chicken spot that lives up to the hype! The Jus Chick-Hen sandwich is incredible. Crispy chicken, pickles, hot honey drizzle - chef's kiss.",
    rating: 5,
    date: "1 week ago",
  },
  {
    id: 5,
    name: "Anthony R.",
    text: "I drove from the South Side just to try this place and it was 1000% worth it. The hot honey sauce is like nothing else in Chicago. Now I'm a regular.",
    rating: 5,
    date: "2 months ago",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < rating ? "fill-brand-gold text-brand-gold" : "text-gray-300"}
        />
      ))}
    </div>
  );
}

export function ReviewsCarousel() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % reviews.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, next]);

  return (
    <section id="reviews" className="py-20 md:py-28 bg-brand-cream">
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
            What People Say
          </span>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl md:text-6xl font-bold text-brand-brown">
            Real <span className="text-gradient-brand">Reviews</span>
          </h2>
        </motion.div>

        {/* Carousel */}
        <div
          className="relative max-w-3xl mx-auto"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="overflow-hidden rounded-3xl bg-white shadow-lg min-h-[240px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={reviews[current].id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="px-8 py-10 md:px-12 md:py-14 text-center w-full"
              >
                <StarRating rating={reviews[current].rating} />
                <p className="mt-5 text-lg md:text-xl text-brand-brown/80 leading-relaxed italic">
                  &ldquo;{reviews[current].text}&rdquo;
                </p>
                <div className="mt-6">
                  <p className="font-display font-bold text-brand-brown">
                    {reviews[current].name}
                  </p>
                  <p className="text-sm text-brand-brown/40">{reviews[current].date}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-brand-brown/60 hover:text-brand-red transition-colors"
            aria-label="Previous review"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-brand-brown/60 hover:text-brand-red transition-colors"
            aria-label="Next review"
          >
            <ChevronRight size={20} />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i === current
                    ? "bg-brand-red w-8"
                    : "bg-brand-brown/20 hover:bg-brand-brown/40"
                }`}
                aria-label={`Go to review ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Yelp Link */}
        {brand.thirdParty.yelp && (
          <motion.div
            className="text-center mt-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <a
              href={brand.thirdParty.yelp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-brand-red font-semibold hover:underline"
            >
              See more reviews on Yelp
              <ExternalLink size={16} />
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
