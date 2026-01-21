import { supabaseServer } from "@/lib/supabase/server";

import { SubscriptionPlansClient } from "@/components/subscription-plans-client";

const fallbackValues = {
  eyebrow: "COMPANY VALUES",
  title: "The Prime Advantage",
  description:
    "We don't just supply products; we build 'Partnerships of Success.' By prioritizing your project goals, we deliver elite engineered solutions that balance quality with cost-efficiency.",
  benefits: [
    "Top-Tier Class A Products",
    "Cost-Effective Value Engineering",
    "End-to-End Technical Support",
    "Professional Safety Standards",
    "Tailored System Solutions",
  ],
  buttonLabel: "View Our Projects",
  buttonHref: "/projects",
  imageUrl: "/images/sections/prime-advantage.webp",
  imagePath: "",
  highlightTitle: "SWITCH TO PERFECTION",
  highlightDescription:
    "Experience the highest level of expectations in the market.",
  highlightButtonLabel: "Get A Quote",
  highlightButtonHref: "/contact",
};

export async function SubscriptionPlans() {
  const { data } = await supabaseServer
    .from("home_company_values")
    .select("*")
    .order("id", { ascending: true })
    .limit(1)
    .maybeSingle();

  const values = data
    ? {
        eyebrow: data.eyebrow,
        title: data.title,
        description: data.description,
        benefits: [
          data.benefit1,
          data.benefit2,
          data.benefit3,
          data.benefit4,
          data.benefit5,
        ],
        buttonLabel: data.button_label,
        buttonHref: data.button_href,
        imageUrl: data.image_url || "/images/sections/prime-advantage.webp",
        imagePath: data.image_path ?? "",
        highlightTitle: data.highlight_title,
        highlightDescription: data.highlight_description,
        highlightButtonLabel: data.highlight_button_label,
        highlightButtonHref: data.highlight_button_href || "/contact",
      }
    : fallbackValues;

  return <SubscriptionPlansClient values={values} />;
}
