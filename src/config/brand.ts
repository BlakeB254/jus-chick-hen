// ============================================================
// BRAND CONFIGURATION — Jus Chick-Hen Inc
// 3602 W 16th St, Chicago, IL 60623
// ============================================================

export type IntensityMode = "subtle" | "immersive";
export type HeroVariant = "centered" | "split" | "fullscreen" | "parallax";

export interface NavLink {
  href: string;
  label: string;
  children?: { href: string; label: string; description: string }[];
}

export interface SectionConfig {
  id: string;
  type: "hero" | "features" | "cta" | "testimonials" | "stats" | "gallery" | "contact" | "custom";
  enabled: boolean;
}

export interface BrandConfig {
  name: string;
  tagline: string;
  description: string;
  url: string;
  contactEmail: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    lat: number;
    lng: number;
  };
  hours: { day: string; open: string; close: string }[];
  intensity: IntensityMode;
  heroVariant: HeroVariant;
  darkMode: "dark-only" | "light-only" | "toggle";
  colors: {
    primary: string;
    primaryForeground: string;
    accent: string;
    accentForeground: string;
    background: string;
    foreground: string;
    surface: string;
    muted: string;
    mutedForeground: string;
  };
  nav: NavLink[];
  sections: SectionConfig[];
  seo: {
    title: string;
    titleTemplate: string;
    description: string;
    keywords: string[];
  };
  social: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    youtube?: string;
    tiktok?: string;
  };
  thirdParty: {
    doordash?: string;
    grubhub?: string;
    ubereats?: string;
    yelp?: string;
  };
  kmp: boolean;
}

export const brand: BrandConfig = {
  name: "Jus Chick-Hen",
  tagline: "Home of the Hot Honey Chicken & Hot Honey Catfish",
  description: "Chicago's North Lawndale favorite — crispy fried chicken, signature hot honey sauce, creative eggrolls, and so much more. Takeout & delivery.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  contactEmail: "info@juschickhen.com",
  phone: "(773) 565-4733",
  address: {
    street: "3602 W 16th St",
    city: "Chicago",
    state: "IL",
    zip: "60623",
    lat: 41.8584,
    lng: -87.7148,
  },
  hours: [
    { day: "Monday", open: "12:00 PM", close: "6:00 PM" },
    { day: "Tuesday", open: "11:00 AM", close: "10:00 PM" },
    { day: "Wednesday", open: "11:00 AM", close: "10:00 PM" },
    { day: "Thursday", open: "11:00 AM", close: "10:00 PM" },
    { day: "Friday", open: "11:00 AM", close: "10:00 PM" },
    { day: "Saturday", open: "11:00 AM", close: "10:00 PM" },
    { day: "Sunday", open: "11:00 AM", close: "10:00 PM" },
  ],

  intensity: "immersive",
  heroVariant: "fullscreen",
  darkMode: "light-only",

  colors: {
    primary: "#CC0000",
    primaryForeground: "#FFFFFF",
    accent: "#FFD700",
    accentForeground: "#1A0A00",
    background: "#FFFDF5",
    foreground: "#1A1A1A",
    surface: "#FFF8E7",
    muted: "#F5F0E0",
    mutedForeground: "#666666",
  },

  nav: [
    { href: "/menu", label: "Menu" },
    { href: "/order", label: "Order Online" },
    { href: "/#about", label: "About" },
    { href: "/#reviews", label: "Reviews" },
    { href: "/#location", label: "Find Us" },
  ],

  sections: [
    { id: "hero", type: "hero", enabled: true },
    { id: "featured", type: "features", enabled: true },
    { id: "about", type: "custom", enabled: true },
    { id: "reviews", type: "testimonials", enabled: true },
    { id: "location", type: "contact", enabled: true },
    { id: "cta", type: "cta", enabled: true },
  ],

  seo: {
    title: "Jus Chick-Hen — Hot Honey Chicken & More | Chicago",
    titleTemplate: "%s | Jus Chick-Hen Chicago",
    description: "Order the best fried chicken in North Lawndale, Chicago. Famous hot honey chicken, catfish, specialty eggrolls, and pizza. Takeout & delivery.",
    keywords: [
      "jus chick-hen", "chicago fried chicken", "north lawndale restaurant",
      "hot honey chicken", "chicken delivery chicago", "best chicken chicago",
      "eggrolls chicago", "catfish dinner", "west side chicago food",
    ],
  },

  social: {
    instagram: "https://www.instagram.com/juschickhen/",
    facebook: "https://www.facebook.com/juschickhen/",
  },

  thirdParty: {
    doordash: "https://www.doordash.com/en/store/jus-chick-hen-chicago-24400167/",
    grubhub: "https://www.grubhub.com/restaurant/jus-chick-hen-3602-w-16th-st-chicago/3316217",
    yelp: "https://www.yelp.com/biz/jus-chick-hen-chicago",
  },

  kmp: false,
};
