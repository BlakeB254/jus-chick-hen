import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, MapPin, Phone, Clock, ExternalLink } from "lucide-react";
import { brand } from "@/config/brand";

export function StorefrontFooter() {
  const year = new Date().getFullYear();
  const { address, phone, hours } = brand;
  const fullAddress = `${address.street}, ${address.city}, ${address.state} ${address.zip}`;

  // Consolidate hours display (Tue-Sun same hours)
  const mondayHours = hours.find((h) => h.day === "Monday");
  const tuesdayHours = hours.find((h) => h.day === "Tuesday");

  return (
    <footer className="bg-brand-brown text-white">
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.jpg" alt="Jus Chick-Hen" width={40} height={40} className="rounded-full" />
              <span className="font-display text-2xl font-bold text-brand-gold">Jus Chick-Hen</span>
            </Link>
            <p className="mt-3 text-white/60 text-sm leading-relaxed">
              {brand.tagline}
            </p>
            {/* Social Links */}
            <div className="mt-5 flex gap-3">
              {brand.social.instagram && (
                <a
                  href={brand.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-brand-red transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={18} />
                </a>
              )}
              {brand.social.facebook && (
                <a
                  href={brand.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-brand-red transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Location */}
          <div>
            <h4 className="font-display text-base font-bold text-brand-gold mb-4">Location</h4>
            <div className="flex gap-2 text-sm text-white/60">
              <MapPin size={16} className="shrink-0 mt-0.5" />
              <div>
                <p>{address.street}</p>
                <p>{address.city}, {address.state} {address.zip}</p>
              </div>
            </div>
            <div className="flex gap-2 text-sm text-white/60 mt-3">
              <Phone size={16} className="shrink-0 mt-0.5" />
              <a href={`tel:${phone.replace(/[^0-9+]/g, "")}`} className="hover:text-white transition-colors">
                {phone}
              </a>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-display text-base font-bold text-brand-gold mb-4">Hours</h4>
            <div className="space-y-1.5 text-sm text-white/60">
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="shrink-0" />
                <span>Mon: {mondayHours?.open} &ndash; {mondayHours?.close}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="shrink-0" />
                <span>Tue&ndash;Sun: {tuesdayHours?.open} &ndash; {tuesdayHours?.close}</span>
              </div>
            </div>
          </div>

          {/* Order Online */}
          <div>
            <h4 className="font-display text-base font-bold text-brand-gold mb-4">Order Online</h4>
            <div className="space-y-2">
              {brand.thirdParty.doordash && (
                <a
                  href={brand.thirdParty.doordash}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
                >
                  <ExternalLink size={14} />
                  DoorDash
                </a>
              )}
              {brand.thirdParty.grubhub && (
                <a
                  href={brand.thirdParty.grubhub}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
                >
                  <ExternalLink size={14} />
                  Grubhub
                </a>
              )}
              {brand.thirdParty.yelp && (
                <a
                  href={brand.thirdParty.yelp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
                >
                  <ExternalLink size={14} />
                  Yelp
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-white/40">
          <p>&copy; {year} {brand.name}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/menu" className="hover:text-white transition-colors">Menu</Link>
            <Link href="/order" className="hover:text-white transition-colors">Order</Link>
            <Link href="/#location" className="hover:text-white transition-colors">Find Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
