import { FastChargeStepsClient } from "@/components/fast-charge-steps-client";
import { supabaseServer } from "@/lib/supabase/server";

const fallbackSteps = {
  title: "Complete Electrical Sourcing in 3 Easy Steps",
  steps: [
    {
      title: "Select or Request",
      description:
        "Buy stock items instantly, or request quotes for specialized parts from our partner catalogs.",
      imageUrl: "/images/sections/prime-advantage.webp",
    },
    {
      title: "Technical Verification",
      description:
        "Our engineers review your request to ensure compatibility and availability before finalizing the order.",
      imageUrl: "/images/sections/prime-advantage.webp",
    },
    {
      title: "Site-Ready Supply",
      description:
        "Get your full electrical list delivered to your site, exactly when you need it.",
      imageUrl: "/images/sections/prime-advantage.webp",
    },
  ],
};

export async function FastChargeSteps() {
  const { data } = await supabaseServer
    .from("home_steps")
    .select("*")
    .order("id", { ascending: true })
    .limit(1)
    .maybeSingle();

  const hasContent =
    data &&
    [data.title, data.step1_title, data.step2_title, data.step3_title].some(
      (value) => value?.trim(),
    );

  const content = hasContent
    ? {
        title: data.title || fallbackSteps.title,
        steps: [
          {
            title: data.step1_title || fallbackSteps.steps[0].title,
            description:
              data.step1_description || fallbackSteps.steps[0].description,
            imageUrl:
              data.step1_image_url ?? "/images/sections/prime-advantage.webp",
          },
          {
            title: data.step2_title || fallbackSteps.steps[1].title,
            description:
              data.step2_description || fallbackSteps.steps[1].description,
            imageUrl:
              data.step2_image_url ?? "/images/sections/prime-advantage.webp",
          },
          {
            title: data.step3_title || fallbackSteps.steps[2].title,
            description:
              data.step3_description || fallbackSteps.steps[2].description,
            imageUrl:
              data.step3_image_url ?? "/images/sections/prime-advantage.webp",
          },
        ],
      }
    : fallbackSteps;

  return <FastChargeStepsClient {...content} />;
}
