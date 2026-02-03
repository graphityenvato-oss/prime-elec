"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type BoardMember = {
  name: string;
  role: string;
  image: string;
};

type AboutBoardProps = {
  members: BoardMember[];
};

export function AboutBoard({ members }: AboutBoardProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-3">
      {members.map((member) => (
        <motion.div
          key={member.name}
          className="group overflow-hidden rounded-3xl border border-border/60 bg-background/80 shadow-[0_18px_45px_rgba(0,0,0,0.08)] will-change-transform dark:border-white/10 dark:bg-white/5"
          whileHover={{
            y: -6,
            boxShadow: "0 26px 60px rgba(0,0,0,0.12)",
          }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
        >
          <div className="relative h-52 overflow-hidden bg-muted/30 dark:bg-white/5">
            <Image
              src={member.image}
              alt={member.name}
              fill
              className="object-cover object-[center_20%] transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </div>
          <div className="flex flex-col gap-1 px-5 py-4">
            <p className="text-base font-semibold text-primary">
              {member.name}
            </p>
            <p className="text-xs uppercase tracking-[0.2em] text-primary/80 dark:text-primary/90">
              {member.role}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
