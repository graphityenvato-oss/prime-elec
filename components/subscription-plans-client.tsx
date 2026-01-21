"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { PrimeCard } from "@/components/ui/prime-card";

type CompanyValues = {
  eyebrow: string;
  title: string;
  description: string;
  benefits: string[];
  buttonLabel: string;
  buttonHref: string;
  imageUrl: string;
  highlightTitle: string;
  highlightDescription: string;
  highlightButtonLabel: string;
  highlightButtonHref: string;
};

type SubscriptionPlansClientProps = {
  values: CompanyValues;
};

export function SubscriptionPlansClient({
  values,
}: SubscriptionPlansClientProps) {
  return (
    <section className="mt-16 overflow-hidden rounded-[32px] border border-primary/40 bg-primary px-6 py-10 text-white shadow-[0_30px_80px_rgba(0,0,0,0.18)]">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/70">
            {values.eyebrow}
          </p>
          <Reveal>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight">
              {values.title}
            </h2>
          </Reveal>
          <p className="mt-3 max-w-lg text-sm text-white/80">
            {values.description}
          </p>

          <ul className="mt-6 space-y-3 text-sm text-white">
            {values.benefits.map((item, index) => (
              <motion.li
                key={`${item}-${index}`}
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
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-white">
                  <Check className="size-3" />
                </span>
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>

          <Button
            asChild
            className="mt-8 rounded-full bg-white px-6 py-2 text-sm font-semibold text-primary hover:bg-white/90"
          >
            <a href={values.buttonHref}>{values.buttonLabel}</a>
          </Button>
        </div>

        <div className="relative min-h-80 overflow-hidden rounded-3xl border border-white/20">
          <Image
            src={values.imageUrl}
            alt={values.title}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 40vw, 100vw"
          />
          <div className="absolute inset-0 bg-linear-to-tr from-primary/70 via-transparent to-white/15" />
          <PrimeCard className="absolute right-6 top-6 w-48 rounded-2xl border-white/20 bg-white/10 p-4 text-sm text-white shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
            <div className="text-lg font-semibold">{values.highlightTitle}</div>
            <p className="mt-1 text-xs text-white/70">
              {values.highlightDescription}
            </p>
            <Button
              asChild
              variant="outline"
              className="mt-4 w-full rounded-full border-white/40 text-black hover:bg-white/15 dark:text-white"
            >
              <a href={values.highlightButtonHref}>
                {values.highlightButtonLabel}
              </a>
            </Button>
          </PrimeCard>
        </div>
      </div>
    </section>
  );
}
