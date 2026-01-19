import { Reveal } from "@/components/reveal";
import { StatsGrid } from "@/components/stats-grid";
import { Button } from "@/components/ui/button";
import HeroVisual from "@/components/hero-visual";
import { supabaseServer } from "@/lib/supabase/server";

const fallbackHero = {
  mainTitle: "Powering Electrical Projects with Precision.",
  subtitle: "PrimeElec",
  description:
    "Engineering-grade supply, project-ready stock, and technical support for industrial, commercial, and power sector builds.",
  primaryButtonLabel: "Request Quote",
  primaryButtonHref: "/contact",
  secondaryButtonLabel: "View Catalog",
  secondaryButtonHref: "/brands",
};

export async function Hero() {
  const { data } = await supabaseServer
    .from("home_hero")
    .select("*")
    .order("id", { ascending: true })
    .limit(1)
    .maybeSingle();

  const hero = data
    ? {
        mainTitle: data.main_title,
        subtitle: data.subtitle,
        description: data.description,
        primaryButtonLabel: data.primary_button_label,
        primaryButtonHref: data.primary_button_href,
        secondaryButtonLabel: data.secondary_button_label,
        secondaryButtonHref: data.secondary_button_href,
      }
    : fallbackHero;

  return (
    <section className="pt-10 sm:pt-14">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="text-center lg:text-left">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              {hero.subtitle}
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {hero.mainTitle}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-base lg:mx-0 mx-auto">
              {hero.description}
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Button
                asChild
                className="rounded-full bg-primary px-6 sm:w-auto w-full"
              >
                <a href={hero.primaryButtonHref}>
                  {hero.primaryButtonLabel}
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full px-6 sm:w-auto w-full"
              >
                <a href={hero.secondaryButtonHref}>
                  {hero.secondaryButtonLabel}
                </a>
              </Button>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <HeroVisual />
        </Reveal>
      </div>
      <StatsGrid />
    </section>
  );
}
