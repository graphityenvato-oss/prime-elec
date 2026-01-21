import Image from "next/image";

import { Reveal } from "@/components/reveal";
import { PrimeCard } from "@/components/ui/prime-card";
import { supabaseServer } from "@/lib/supabase/server";

const fallbackMission = {
  title: "Mission & Vision",
  description:
    "We aim to be recognized as the premier partner in our field by delivering top-tier electrical products and tailored system solutions. We prioritize customer success and build trust through expert support and elite engineering.",
  imageUrl: "/images/sections/mission-vission-prime.webp",
  cards: [
    {
      title: "Engineering & Design",
      description:
        "Supporting consultants and contractors with assistance ranging from initial design to cost-effective value engineering for specialized systems.",
    },
    {
      title: "Strategic Trading",
      description:
        "Supplying elite electrical products from class A companies and providing state-of-the-art system solutions for residential, industrial, and power projects.",
    },
    {
      title: "Site Supervision",
      description:
        "Providing professional support regarding the supervision of system installations to ensure safety and adherence to professional market standards.",
    },
    {
      title: "Testing & Commissioning",
      description:
        "Conducting final testing and commissioning using the latest technologies and instruments to ensure your systems are fully operational and secure.",
    },
  ],
};

export async function MissionVision() {
  const { data } = await supabaseServer
    .from("home_mission")
    .select("*")
    .order("id", { ascending: true })
    .limit(1)
    .maybeSingle();

  const mission = data
    ? {
        title: data.title,
        description: data.description,
        imageUrl:
          data.image_url || "/images/sections/mission-vission-prime.webp",
        imagePath: data.image_path ?? "",
        cards: [
          { title: data.card1_title, description: data.card1_description },
          { title: data.card2_title, description: data.card2_description },
          { title: data.card3_title, description: data.card3_description },
          { title: data.card4_title, description: data.card4_description },
        ],
      }
    : fallbackMission;

  return (
    <section className="mt-16 rounded-[32px] border border-border/60 bg-linear-to-br from-background via-background to-muted/30 p-8 text-foreground shadow-[0_25px_60px_rgba(0,0,0,0.12)]">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <Reveal>
          <h2 className="text-3xl font-extrabold tracking-tight">
            {mission.title}
          </h2>
        </Reveal>
        <p className="max-w-md text-sm text-muted-foreground">
          {mission.description}
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_1.4fr]">
        <div className="relative min-h-[20rem] overflow-hidden rounded-3xl border border-border/70">
          <Image
            src={mission.imageUrl}
            alt={mission.title}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 45vw, 100vw"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {mission.cards.map((card, index) => (
            <Reveal key={`${card.title}-${index}`} delay={index * 0.08}>
              <PrimeCard
                className={`p-5 ${
                  index === 0 ? "ring-1 ring-primary/60 shadow-primary/20" : ""
                }`}
              >
                <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full border border-border/70 text-xs font-semibold text-white">
                  {index + 1}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {card.description}
                </p>
              </PrimeCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
