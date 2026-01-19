"use client";

import CountUp from "react-countup";

import LiquidGlassCard from "@/components/ui/LiquidGlassCard";
import { Reveal } from "@/components/reveal";

const stats = [
  { title: "SUCCESSFUL PROJECTS", value: 220, suffix: "+" },
  { title: "YEARS OF EXPERIENCE", value: 7, suffix: "+" },
  { title: "ELITE PARTNERS", value: 20, suffix: "+" },
  { title: "SPECIALIZED SYSTEMS", value: 5, suffix: "+" },
];

export function StatsGrid() {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Reveal key={stat.title} delay={index * 0.08}>
          <LiquidGlassCard title={stat.title}>
            <div className="text-3xl font-semibold tracking-tight">
              <CountUp end={stat.value} duration={2} suffix={stat.suffix} />
            </div>
          </LiquidGlassCard>
        </Reveal>
      ))}
    </div>
  );
}
