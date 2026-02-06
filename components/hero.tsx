import { HeroArrows } from "@/components/hero-arrows";
import { HeroImageRotator } from "@/components/hero-image-rotator";
import { Reveal } from "@/components/reveal";
import { supabaseServer } from "@/lib/supabase/server";

const fallbackHero = {
  mainTitle: "SWITCH TO PERFECTION",
  subtitle: "PrimeElec",
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
  const mainTitle = hero.mainTitle.replace("SWITCH TO ", "SWITCH TO\n");
  const heroImages = [
    { src: "/images/hero/h1.webp", alt: "Prime Elec hero" },
    { src: "/images/hero/h3.webp", alt: "Prime Elec hero" },
    { src: "/images/hero/h2.webp", alt: "Prime Elec hero" },
    { src: "/images/hero/h4.webp", alt: "Prime Elec hero" },
    { src: "/images/hero/h5.webp", alt: "Prime Elec hero" },
  ];

  return (
    <section className="hero-screen-fix relative left-1/2 right-1/2 flex w-screen -mx-[50vw] min-h-[calc(100vh-5rem)] min-h-[calc(100dvh-5rem)] items-center overflow-hidden bg-white py-10 text-foreground dark:bg-[#0b1118] dark:text-white sm:py-14">
      <div className="pointer-events-none absolute inset-0 bg-[url('/images/hero/bgg.png')] bg-cover bg-[position:85%_center] opacity-40 dark:opacity-70 sm:bg-center" />
      <HeroArrows />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-center justify-items-center">
          <div className="text-left justify-self-start">
            <Reveal>
              <p className="text-xs uppercase tracking-[0.3em] text-foreground/70">
                {hero.subtitle}
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-3 whitespace-pre-line text-4xl font-extrabold tracking-tight text-primary sm:text-5xl lg:text-7xl">
                {mainTitle}
              </h1>
            </Reveal>
          </div>
          <div className="relative isolate mx-auto w-full max-w-xl max-h-[calc(100dvh-10rem)] overflow-hidden rounded-3xl border border-border/60 bg-muted/5 shadow-[0_25px_80px_rgba(0,0,0,0.2)] lg:max-w-none">
            <HeroImageRotator images={heroImages} intervalMs={5000} />
          </div>
        </div>
      </div>
    </section>
  );
}
