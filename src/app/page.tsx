import { brand } from "@/config/brand";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturesGrid } from "@/components/sections/FeaturesGrid";
import { StatsSection } from "@/components/sections/StatsSection";
import { CTASection } from "@/components/sections/CTASection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";

const sectionComponents: Record<string, React.FC> = {
  hero: HeroSection,
  features: FeaturesGrid,
  stats: StatsSection,
  cta: CTASection,
  testimonials: TestimonialsSection,
};

export default function HomePage() {
  const activeSections = brand.sections.filter((s) => s.enabled);

  return (
    <>
      <Navbar />
      <main>
        {activeSections.map((section) => {
          const Component = sectionComponents[section.type];
          if (!Component) return null;
          return <Component key={section.id} />;
        })}
      </main>
      <Footer />
    </>
  );
}
