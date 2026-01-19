"use client";

import { useState } from "react";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { primeCardClassName } from "@/components/ui/prime-card";
import { cn } from "@/lib/utils";

const steps = [
  {
    title: "Select or Request",
    subtext:
      "Buy stock items instantly, or request quotes for specialized parts from our partner catalogs.",
  },
  {
    title: "Technical Verification",
    subtext:
      "Our engineers review your request to ensure compatibility and availability before finalizing the order.",
  },
  {
    title: "Site-Ready Supply",
    subtext:
      "Get your full electrical list delivered to your site, exactly when you need it.",
  },
];

export function FastChargeSteps() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="mt-16">
      <div className="rounded-[32px] border border-border/60 bg-linear-to-br from-muted/40 via-background to-background p-8 shadow-[0_30px_80px_rgba(0,0,0,0.18)]">
        <Reveal>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            Complete Electrical Sourcing in 3 Easy Steps
          </h2>
        </Reveal>

        <div className="mt-8 flex flex-col gap-5 lg:flex-row">
          {steps.map((step, index) => {
            const isActive = index === activeIndex;
            const backgroundClass =
              "bg-[url('/images/sections/prime-advantage.webp')]";

            return (
              <motion.div
                key={step.title}
                role="button"
                tabIndex={0}
                aria-pressed={isActive}
                onClick={() => setActiveIndex(index)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setActiveIndex(index);
                  }
                }}
                className={cn(
                  primeCardClassName,
                  "relative w-full overflow-hidden rounded-3xl border-border/70 p-6 transition-[opacity,transform] duration-300",
                  isActive
                    ? `${backgroundClass} bg-cover bg-center`
                    : "bg-muted/70",
                  isActive ? "min-h-75" : "min-h-60",
                )}
                animate={{
                  scale: isActive ? 1 : 0.98,
                  flexBasis: isActive ? "60%" : "20%",
                  opacity: isActive ? 1 : 0.9,
                }}
                transition={{ type: "spring", stiffness: 250, damping: 24 }}
              >
                {isActive ? (
                  <div className="absolute inset-0 bg-background/65" />
                ) : null}

                <div className="relative flex h-full flex-col justify-between">
                  <h3
                    className={`text-2xl font-semibold text-foreground ${
                      isActive ? "max-w-55" : "max-w-32"
                    }`}
                  >
                    {step.title}
                  </h3>

                  <div className="mt-6 flex items-center justify-between gap-4">
                    {isActive ? (
                      <motion.p
                        className="text-md text-muted-foreground font-black"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        {step.subtext}
                      </motion.p>
                    ) : (
                      <span />
                    )}
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-full border ${
                        isActive
                          ? "border-primary/40 bg-primary text-primary-foreground"
                          : "border-border/70 text-muted-foreground"
                      }`}
                    >
                      <ArrowRight className="size-4" />
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
