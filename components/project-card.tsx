"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { primeCardClassName } from "@/components/ui/prime-card";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  title: string;
  summary: string;
  tags: string[];
};

export function ProjectCard({ title, summary, tags }: ProjectCardProps) {
  return (
    <motion.div
      className={cn(primeCardClassName, "group flex h-full flex-col p-5")}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <div className="relative h-40 w-full overflow-hidden rounded-xl border border-border/60 bg-muted/20">
        <Image
          src="/images/placeholder/imageholder.webp"
          alt={title}
          fill
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 100vw"
        />
      </div>
      <h2 className="mt-4 text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-border/60 bg-primary/20 px-3 py-1 text-xs text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-auto pt-5">
        <Button variant="outline" className="rounded-full">
          View project
        </Button>
      </div>
    </motion.div>
  );
}
