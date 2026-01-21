import { EvcsNews } from "@/components/evcs-news";
import { Hero } from "@/components/hero";
import { FeaturedStock } from "@/components/featured-stock";
import { Testimonials } from "@/components/testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedStock />
      <Testimonials />
      <EvcsNews />
    </>
  );
}
