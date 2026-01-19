"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { PrimeCard } from "@/components/ui/prime-card";

const benefits = [
  "Top-Tier Class A Products",
  "Cost-Effective Value Engineering",
  "End-to-End Technical Support",
  "Professional Safety Standards",
  "Tailored System Solutions",
];

export function SubscriptionPlans() {
  return (
    <section className="mt-16 overflow-hidden rounded-[32px] border border-border/60 bg-linear-to-br from-muted/40 via-background to-background px-6 py-10 shadow-[0_30px_80px_rgba(0,0,0,0.18)]">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            COMPANY VALUES
          </p>
          <Reveal>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight">
              The Prime Advantage
            </h2>
          </Reveal>
          <p className="mt-3 max-w-lg text-sm text-muted-foreground">
            We don&apos;t just supply products; we build &apos;Partnerships of
            Success.&apos; By prioritizing your project goals, we deliver elite
            engineered solutions that balance quality with cost-efficiency.
          </p>

          <ul className="mt-6 space-y-3 text-sm text-foreground">
            {benefits.map((item, index) => (
              <motion.li
                key={item}
                className="flex items-center gap-3"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 0.35,
                  ease: "easeOut",
                  delay: index * 0.08,
                }}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Check className="size-3" />
                </span>
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>

          <Button className="mt-8 rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            View Our Projects
          </Button>
        </div>

        <div className="relative min-h-80 rounded-3xl border border-border/60 bg-[url('/images/sections/prime-advantage.webp')] bg-cover bg-center">
          <div className="absolute inset-0 bg-linear-to-tr from-background/80 via-transparent to-primary/10" />
          <PrimeCard className="absolute right-6 top-6 w-48 rounded-2xl border-border/70 bg-background/70 p-4 text-sm shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
            <div className="text-lg font-semibold">SWITCH TO PERFECTION</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Experience the highest level of expectations in the market.
            </p>
            <Button variant="outline" className="mt-4 w-full rounded-full">
              Get A Quote
            </Button>
          </PrimeCard>
        </div>
      </div>
    </section>
  );
}
