import Image from "next/image";
import { Briefcase, Cog, ShieldCheck } from "lucide-react";

const services = [
  {
    title: "Trading",
    description:
      "Supplying customers with elite electrical products from class A companies, in addition to state-of-the-art system solutions for residential, industrial, power, and energy projects.",
    icon: Briefcase,
  },
  {
    title: "Engineering",
    description:
      "Supporting consultants and contractors from design to cost-effective value engineering for specialized systems, lighting protection, central battery, and emergency lighting.",
    icon: Cog,
  },
  {
    title: "Supervision & Testing",
    description:
      "Providing supervision on system installation and commissioning, alongside testing with the latest technologies and instruments.",
    icon: ShieldCheck,
  },
];

export function AboutServicesSection() {
  return (
    <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_1fr] lg:items-stretch">
      <div className="rounded-[32px] border border-border/60 bg-muted/20 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-white/5">
        <div className="inline-flex items-center gap-3 rounded-2xl bg-muted/50 px-5 py-4 dark:bg-white/5">
          <span className="text-xl font-extrabold tracking-tight text-foreground">
            Our
          </span>
          <span className="text-xl font-extrabold tracking-tight text-primary">
            Services
          </span>
        </div>

        <div className="mt-6 space-y-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="flex flex-col gap-4 rounded-3xl bg-background/80 p-4 shadow-[0_14px_30px_rgba(0,0,0,0.06)] dark:bg-white/5 sm:flex-row sm:items-center"
            >
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <service.icon className="size-9" />
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground dark:text-foreground/80">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[32px] border border-border/60 shadow-[0_24px_70px_rgba(0,0,0,0.2)] dark:border-white/10">
        <Image
          src="/images/about/primeElec-services.jpg"
          alt="Prime Elec services"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8 max-w-md text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
            Prime Elec
          </p>
          <h3 className="mt-3 text-2xl font-extrabold leading-tight">
            Identify your problem, but give your power &amp; energy to
            solutions.
          </h3>
        </div>
      </div>
    </section>
  );
}
