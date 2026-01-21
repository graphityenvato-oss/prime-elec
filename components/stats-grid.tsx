"use client";

import CountUp from "react-countup";

import LiquidGlassCard from "@/components/ui/LiquidGlassCard";
import { Reveal } from "@/components/reveal";

export type StatItem = {
  title: string;
  value: number;
  suffix?: string;
};

type StatsGridProps = {
  stats: StatItem[];
};

export function StatsGrid({ stats }: StatsGridProps) {
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
