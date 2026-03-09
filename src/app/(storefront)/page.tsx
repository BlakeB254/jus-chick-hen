import { HeroSection } from "@/components/storefront/HeroSection";
import { FeaturedMenu } from "@/components/storefront/FeaturedMenu";
import { AboutSection } from "@/components/storefront/AboutSection";
import { ReviewsCarousel } from "@/components/storefront/ReviewsCarousel";
import { LocationSection } from "@/components/storefront/LocationSection";
import { OrderCTA } from "@/components/storefront/OrderCTA";

export default function StorefrontHomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedMenu />
      <AboutSection />
      <ReviewsCarousel />
      <LocationSection />
      <OrderCTA />
    </>
  );
}
