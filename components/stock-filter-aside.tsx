"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

const brands = [
  "Eaton",
  "Teknoware",
  "OBO Bettermann",
  "Indelec",
  "Degson",
  "Relpol",
  "TEM",
];

const categories = [
  "Power Distribution",
  "Industrial Automation",
  "Lighting & Safety",
  "Energy Management",
  "Wiring Devices",
  "Cables & Accessories",
];

export function StockFilterAside() {
  return (
    <aside className="rounded-2xl border border-border/60 bg-background p-5 shadow-[0_18px_40px_rgba(12,28,60,0.08)]">
      <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Filters
      </h2>

      <div className="mt-5">
        <h3 className="text-sm font-semibold text-primary">Brands</h3>
        <div className="mt-3 space-y-3">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-2 text-sm">
              <Checkbox />
              <span>{brand}</span>
            </label>
          ))}
        </div>
      </div>

      <Separator className="my-5" />

      <div>
        <h3 className="text-sm font-semibold text-primary">Categories</h3>
        <div className="mt-3 space-y-3">
          {categories.map((category) => (
            <label key={category} className="flex items-center gap-2 text-sm">
              <Checkbox />
              <span>{category}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
