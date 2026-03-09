import { brand } from "@/config/brand";

const dayMap: Record<string, string> = {
  Monday: "Mo",
  Tuesday: "Tu",
  Wednesday: "We",
  Thursday: "Th",
  Friday: "Fr",
  Saturday: "Sa",
  Sunday: "Su",
};

export function RestaurantJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: brand.name,
    description: brand.description,
    url: brand.url,
    telephone: brand.phone,
    email: brand.contactEmail,
    servesCuisine: ["American", "Fried Chicken", "Soul Food", "Seafood"],
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: brand.address.street,
      addressLocality: brand.address.city,
      addressRegion: brand.address.state,
      postalCode: brand.address.zip,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: brand.address.lat,
      longitude: brand.address.lng,
    },
    openingHoursSpecification: brand.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: dayMap[h.day],
      opens: convertTo24(h.open),
      closes: convertTo24(h.close),
    })),
    sameAs: Object.values(brand.social).filter(Boolean),
    hasMenu: `${brand.url}/menu`,
    acceptsReservations: false,
    ...(brand.thirdParty.yelp && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.5",
        reviewCount: "50",
        bestRating: "5",
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: brand.name,
    url: brand.url,
    description: brand.description,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function convertTo24(time12: string): string {
  const [time, period] = time12.split(" ");
  const [hoursStr, minutes] = time.split(":");
  let hours = parseInt(hoursStr);
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return `${hours.toString().padStart(2, "0")}:${minutes}`;
}
