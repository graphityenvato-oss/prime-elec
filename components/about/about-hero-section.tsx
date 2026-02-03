import { AboutBoard } from "@/components/about-board";

const boardMembers = [
  {
    name: "Mohammad Sabra",
    role: "CEO, Founder",
    image: "/images/Team/Mohammad-Sabra-CEO.png",
  },
  {
    name: "Ali Taki",
    role: "Business Development Manager",
    image: "/images/Team/Ali-Taki-BDM.png",
  },
  {
    name: "Hassan Hussein",
    role: "Sales Manager",
    image: "/images/Team/Hassan-Hussein-SM.png",
  },
];

export function AboutHeroSection() {
  return (
    <section className="relative mt-10 overflow-hidden rounded-[32px] border border-border/60 bg-[radial-gradient(circle_at_top,_rgba(10,38,67,0.08),_transparent_60%)] px-6 py-10 shadow-[0_30px_80px_rgba(0,0,0,0.08)] dark:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_60%)] sm:px-10 sm:py-12">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-start">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-3 rounded-2xl bg-muted/50 px-5 py-4 dark:bg-white/5">
            <span className="text-xl font-extrabold tracking-tight text-foreground">
              About
            </span>
            <span className="text-xl font-extrabold tracking-tight text-primary">
              Company
            </span>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.55fr_0.45fr]">
            <div className="rounded-2xl bg-muted/40 p-5 text-sm text-foreground dark:bg-white/5">
              <p className="font-semibold">
                Prime Elec Co. started by the end of 2018 by three ambitious
                partners who challenged the hard recession.
              </p>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground dark:text-foreground/80">
              <p>
                Using their expertise, they demonstrated growth during tough
                times. With focus on carefully selected high-quality products
                and elite engineered systems, they distinguished themselves as a
                unique supplier and solution provider.
              </p>
              <p>
                Prioritizing customers&apos; success and building trust are the
                keys that set us apart from competitors.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="inline-flex items-center gap-3 rounded-2xl bg-muted/50 px-5 py-4 dark:bg-white/5">
            <span className="text-xl font-extrabold tracking-tight text-foreground">
              Our
            </span>
            <span className="text-xl font-extrabold tracking-tight text-primary">
              Board
            </span>
          </div>

          <AboutBoard members={boardMembers} />
        </div>
      </div>

      <div className="mt-10 rounded-[28px] border border-border/60 bg-muted/30 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-white/5">
        <div className="grid gap-6 lg:grid-cols-[0.55fr_0.45fr]">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground dark:text-primary">
              Mission
            </h3>
            <p className="mt-3 text-sm text-muted-foreground dark:text-foreground/80">
              Delivering top-tier electrical products and tailored system
              solutions to MEP contractors and industrial businesses. Our expert
              sales and technical support ensure customer satisfaction, raising
              market standards to professional, safe, and trustworthy levels.
            </p>
            <h3 className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground dark:text-primary">
              Vision
            </h3>
            <p className="mt-3 text-sm text-muted-foreground dark:text-foreground/80">
              To be recognized as the premier partner for customers and the
              foremost authority in our field, offering the full range of
              high-quality, cost-effective products and systems.
            </p>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 p-5 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
              CEO Statement
            </p>
            <h3 className="mt-2 text-2xl font-extrabold">
              Switch to perfection.
            </h3>
            <p className="mt-4 text-sm text-white/80">
              When asking for such things, we are taking ourselves to the
              highest level of expectations in front of the whole market.
              It&apos;s our honor and biggest challenge to be one of the
              founders and leaders of Prime Elec.
            </p>
            <p className="mt-4 text-sm text-white/80">
              We are eager to build a unique relationship with customers and
              suppliers that will be called our partners of success.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
