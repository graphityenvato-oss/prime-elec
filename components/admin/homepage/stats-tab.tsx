"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PrimeCard } from "@/components/ui/prime-card";

type StatFormItem = {
  title: string;
  value: number;
  suffix: string;
};

type StatsTabProps = {
  stats: StatFormItem[];
  status: "idle" | "loading" | "saving" | "error";
  onChange: (index: number, value: Partial<StatFormItem>) => void;
  onSave: () => void;
};

export function StatsTab({ stats, status, onChange, onSave }: StatsTabProps) {
  return (
    <div className="mt-6 grid gap-4">
      {stats.map((stat, index) => (
        <PrimeCard
          key={`stat-${index}`}
          className="grid gap-4 p-4 sm:grid-cols-[1.4fr_0.6fr_0.4fr]"
        >
          <div className="grid gap-2">
            <Label htmlFor={`stat-title-${index}`}>Stat title</Label>
            <Input
              id={`stat-title-${index}`}
              value={stat.title}
              onChange={(event) =>
                onChange(index, { title: event.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`stat-value-${index}`}>Value</Label>
            <Input
              id={`stat-value-${index}`}
              type="number"
              value={stat.value}
              onChange={(event) =>
                onChange(index, {
                  value: Number.isNaN(Number(event.target.value))
                    ? 0
                    : Number(event.target.value),
                })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`stat-suffix-${index}`}>Suffix</Label>
            <Input
              id={`stat-suffix-${index}`}
              value={stat.suffix}
              onChange={(event) =>
                onChange(index, { suffix: event.target.value })
              }
            />
          </div>
        </PrimeCard>
      ))}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          className="rounded-full bg-primary px-6"
          onClick={onSave}
          disabled={status === "saving"}
        >
          {status === "saving" ? "Saving..." : "Save stats"}
        </Button>
      </div>
    </div>
  );
}
