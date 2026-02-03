import { HeroArrows } from "@/components/hero-arrows";
import { Reveal } from "@/components/reveal";
import { PartnerCards, type PartnerCardItem } from "@/components/partner-cards";
import { supabaseServer } from "@/lib/supabase/server";

const fallbackHero = {
  mainTitle: "SWITCH TO PERFECTION",
  subtitle: "PrimeElec",
  description:
    "Engineering-grade supply, project-ready stock, and technical support for industrial, commercial, and power sector builds.",
  primaryButtonLabel: "Request Quote",
  primaryButtonHref: "/contact",
  secondaryButtonLabel: "View Catalog",
  secondaryButtonHref: "/brands",
};

const partnerCards: PartnerCardItem[] = [
  {
    brandName: "Eaton",
    brandLogo: "/images/partners/Eaton-logo.png",
    partName: "MCCB Series",
    productImage: "/images/products/MCCB-Seriess.png",
  },
  {
    brandName: "Degson",
    brandLogo: "/images/partners/degson-logo.png",
    partName: "Terminal Blocks",
    productImage: "/images/products/Terminal-Blockss.png",
  },
  {
    brandName: "OBO Bettermann",
    brandLogo: "/images/partners/obo-logo.png",
    partName: "Cable Trays",
    productImage: "/images/products/Cable-Trayss.png",
  },
  {
    brandName: "Indelec",
    brandLogo: "/images/partners/Indelec-logo.png",
    partName: "Surge Protection",
    productImage: "/images/products/Surge-Protectionn.png",
  },
  {
    brandName: "Teknoware",
    brandLogo: "/images/partners/teknoware-logo.png",
    partName: "Emergency Lighting",
    productImage: "/images/products/Emergency-Lighting.png",
  },
  {
    brandName: "Relpol",
    brandLogo: "/images/partners/Logo-Relpol.png",
    partName: "Control Relays",
    productImage: "/images/products/Control-Relays.png",
  },
  {
    brandName: "TEM",
    brandLogo: "/images/partners/Tem-logo.png",
    partName: "Switchgear",
    productImage: "/images/products/Switchgear.png",
  },
];

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

  return (
    <section className="relative left-1/2 right-1/2 flex w-screen -mx-[50vw] min-h-[calc(100vh-4rem)] items-center overflow-hidden bg-white py-10 text-foreground dark:bg-[#0b1118] dark:text-white sm:py-14">
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
            <Reveal delay={0.1}>
              <p className="mt-4 mx-auto max-w-xl text-sm text-foreground/75 sm:text-base">
                {hero.description}
              </p>
            </Reveal>
          </div>
          <div className="relative isolate mx-auto w-full max-w-md overflow-visible rounded-3xl lg:max-w-none">
            <PartnerCards items={partnerCards} />
          </div>
        </div>
      </div>
    </section>
  );
}

