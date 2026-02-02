import { Reveal } from "@/components/reveal";
import {
  FeaturedStockClient,
  type FeaturedStockCategory,
} from "@/components/featured-stock-client";
import { supabaseServer } from "@/lib/supabase/server";

const categories: FeaturedStockCategory[] = [
  {
    title: "Power Distribution",
    description: "Panels, breakers, and distribution essentials for projects.",
    image: "/images/categories/panels.jpg",
  },
  {
    title: "Industrial Automation",
    description: "PLC, sensors, and control components built for scale.",
    image: "/images/categories/PLC.webp",
  },
  {
    title: "Lighting Solutions",
    description: "Reliable fixtures and emergency lighting systems.",
    image: "/images/categories/emergency.jpg",
  },
  {
    title: "Cable & Accessories",
    description: "Cables, trays, conduits, and installation hardware.",
    image: "/images/categories/cabels.jpg",
  },
  {
    title: "Industrial Auto",
    description: "PLC, sensors, and controls components built for scale.",
    image: "/images/categories/PLC.webp",
  },
];

const fallbackContent = {
  eyebrow: "Featured Stock",
  title: "Featured Stock Categories",
  description:
    "Explore the core categories we keep ready for fast delivery and project-ready availability.",
};

export async function FeaturedStock() {
  const { data } = await supabaseServer
    .from("home_featured_stock")
    .select("*")
    .order("id", { ascending: true })
    .limit(1)
    .maybeSingle();

  const content = data
    ? {
        eyebrow: data.eyebrow,
        title: data.title,
        description: data.description,
      }
    : fallbackContent;

  return (
    <section className="mt-16 rounded-[32px] border border-border/60 bg-background px-6 py-10 text-foreground shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {content.eyebrow}
          </p>
          <Reveal>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-primary">
              {content.title}
            </h2>
          </Reveal>
        </div>
        <p className="max-w-md text-sm text-muted-foreground">
          {content.description}
        </p>
      </div>

      <FeaturedStockClient categories={categories} />
    </section>
  );
}
