import { createMetadata } from "@/lib/metadata";
import { brand } from "@/config/brand";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

export const metadata = createMetadata({
  title: `About | ${brand.name}`,
  description: `Learn more about ${brand.name} — ${brand.tagline}`,
});

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-fib-9">
        <SectionWrapper>
          <ScrollReveal>
            <div className="max-w-3xl mx-auto">
              <h1 className="font-display text-4xl font-bold sm:text-5xl">
                About {brand.name}
              </h1>
              <div className="mt-fib-6 space-y-fib-5 text-lg text-muted-foreground">
                <p>{brand.description}</p>
                <p>
                  We believe in the power of thoughtful design and purposeful technology
                  to create meaningful experiences. Our approach is rooted in timeless
                  principles of harmony and proportion.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}
