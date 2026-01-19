import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type PrimeCardProps = HTMLAttributes<HTMLDivElement>;

export const primeCardClassName =
  "rounded-2xl border border-border/60 bg-background/60 shadow-[0_16px_40px_rgba(0,0,0,0.08)] backdrop-blur";

export function PrimeCard({ className, ...props }: PrimeCardProps) {
  return <div className={cn(primeCardClassName, className)} {...props} />;
}
