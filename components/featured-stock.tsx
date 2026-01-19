import { Reveal } from "@/components/reveal";
import { PrimeCard } from "@/components/ui/prime-card";

const categories = [
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
];

export function FeaturedStock() {
  return (
    <section className="mt-16 rounded-[32px] border border-border/60 bg-background px-6 py-10 text-foreground shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Featured Stock
          </p>
          <Reveal>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight">
              Featured Stock Categories
            </h2>
          </Reveal>
        </div>
        <p className="max-w-md text-sm text-muted-foreground">
          Explore the core categories we keep ready for fast delivery and
          project-ready availability.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category, index) => (
          <Reveal key={category.title} delay={index * 0.08}>
            <PrimeCard className="bg-muted/20 p-5">
              <div
                className="h-36 w-full rounded-xl border border-border/60 bg-cover bg-center"
                style={{ backgroundImage: `url(${category.image})` }}
              />
              <h3 className="mt-4 text-lg font-semibold">{category.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {category.description}
              </p>
              <button className="mt-4 rounded-full border border-border/70 px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted/30">
                Explore category
              </button>
            </PrimeCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
