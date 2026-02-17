import { Reveal } from "@/components/reveal";
import {
  FeaturedStockClient,
  type FeaturedStockCategory,
} from "@/components/featured-stock-client";
import {
  getCategoryPreviewImage,
  getStockBrowseRowsDb,
} from "@/lib/stock-products-db";
import { supabaseServer } from "@/lib/supabase/server";

const fallbackCategories: FeaturedStockCategory[] = [
  {
    title: "Power Distribution",
    description: "Panels, breakers, and distribution essentials for projects.",
    image: "/images/categories/panels.jpg",
    href: "/stock/power-distribution",
  },
  {
    title: "Industrial Automation",
    description: "PLC, sensors, and control components built for scale.",
    image: "/images/categories/PLC.webp",
    href: "/stock/industrial-automation",
  },
  {
    title: "Lighting Solutions",
    description: "Reliable fixtures and emergency lighting systems.",
    image: "/images/categories/emergency.jpg",
    href: "/stock/lighting-solutions",
  },
  {
    title: "Cable & Accessories",
    description: "Cables, trays, conduits, and installation hardware.",
    image: "/images/categories/cabels.jpg",
    href: "/stock/cable-accessories",
  },
  {
    title: "Industrial Auto",
    description: "PLC, sensors, and controls components built for scale.",
    image: "/images/categories/PLC.webp",
    href: "/stock/industrial-auto",
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

  let categories = fallbackCategories;
  try {
    const stockRows = await getStockBrowseRowsDb();
    if (stockRows.length) {
      const byCategory = new Map<
        string,
        {
          title: string;
          image: string;
          products: number;
          subcategories: Set<string>;
        }
      >();

      stockRows.forEach((row) => {
        const key = row.category.trim().toLowerCase();
        const current = byCategory.get(key);
        if (current) {
          current.products += 1;
          current.subcategories.add(row.subcategory);
          return;
        }

        byCategory.set(key, {
          title: row.category,
          image: getCategoryPreviewImage(row),
          products: 1,
          subcategories: new Set([row.subcategory]),
        });
      });

      categories = Array.from(byCategory.values()).map((item) => ({
        title: item.title,
        description: `${item.subcategories.size} subcategories · ${item.products} products`,
        image: item.image,
        href: `/stock/${item.title
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")}`,
      }));
    }
  } catch {
    categories = fallbackCategories;
  }

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
