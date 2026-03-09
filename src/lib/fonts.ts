import { Inter, Oswald, JetBrains_Mono } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});
