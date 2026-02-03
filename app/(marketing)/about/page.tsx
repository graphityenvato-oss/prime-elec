import { AboutHeroSection } from "@/components/about/about-hero-section";
import { AboutServicesSection } from "@/components/about/about-services-section";
import { TrustedBy } from "@/components/trusted-by";

export default function AboutPage() {
  return (
    <>
      <AboutHeroSection />
      <TrustedBy />
      <AboutServicesSection />
    </>
  );
}
