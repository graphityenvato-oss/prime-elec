import { Reveal } from "@/components/reveal";
import { PrimeCard } from "@/components/ui/prime-card";

const steps = [
  {
    id: "1",
    title: "Engineering & Design",
    body: "Supporting consultants and contractors with assistance ranging from initial design to cost-effective value engineering for specialized systems.",
  },
  {
    id: "2",
    title: "Strategic Trading",
    body: "Supplying elite electrical products from class A companies and providing state-of-the-art system solutions for residential, industrial, and power projects.",
  },
  {
    id: "3",
    title: "Site Supervision",
    body: "Providing professional support regarding the supervision of system installations to ensure safety and adherence to professional market standards.",
  },
  {
    id: "4",
    title: "Testing & Commissioning",
    body: "Conducting final testing and commissioning using the latest technologies and instruments to ensure your systems are fully operational and secure.",
  },
];

export function MissionVision() {
  return (
    <section className="mt-16 rounded-[32px] border border-border/60 bg-linear-to-br from-background via-background to-muted/30 p-8 text-foreground shadow-[0_25px_60px_rgba(0,0,0,0.12)]">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <Reveal>
          <h2 className="text-3xl font-extrabold tracking-tight">
            Mission &amp; Vision
          </h2>
        </Reveal>
        <p className="max-w-md text-sm text-muted-foreground">
          We aim to be recognized as the premier partner in our field by
          delivering top-tier electrical products and tailored system solutions.
          We prioritize customer success and build trust through expert support
          and elite engineering.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_1.4fr]">
        <div className="min-h-80 rounded-3xl border border-border/70 bg-[url('/images/sections/mission-vission-prime.webp')] bg-cover bg-center" />

        <div className="grid gap-4 sm:grid-cols-2">
          {steps.map((step, index) => (
            <Reveal key={step.id} delay={index * 0.08}>
              <PrimeCard
                className={`p-5 ${
                  index === 0 ? "ring-1 ring-primary/60 shadow-primary/20" : ""
                }`}
              >
                <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full border border-border/70 text-xs font-semibold text-white">
                  {step.id}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </PrimeCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
