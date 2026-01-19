import { EvcsNews } from "@/components/evcs-news";
import { FastChargeSteps } from "@/components/fast-charge-steps";
import { Hero } from "@/components/hero";
import { FeaturedStock } from "@/components/featured-stock";
import { MissionVision } from "@/components/mission-vision";
import { SubscriptionPlans } from "@/components/subscription-plans";
import { Testimonials } from "@/components/testimonials";
import { TrustedBy } from "@/components/trusted-by";

export default function Home() {
  return (
    <>
      <Hero />
      <MissionVision />
      <FeaturedStock />
      <SubscriptionPlans />
      <TrustedBy />
      <FastChargeSteps />
      <Testimonials />
      <EvcsNews />
    </>
  );
}
