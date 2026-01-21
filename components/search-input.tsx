"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

type SearchInputProps = {
  placeholder: string;
  className?: string;
};

export function SearchInput({ placeholder, className }: SearchInputProps) {
  const [value, setValue] = useState("");

  return (
    <div className={`relative ${className ?? ""}`}>
      <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground dark:text-white/60" />
      <input
        type="text"
        inputMode="search"
        enterKeyHint="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-border/60 bg-white/90 py-2 pl-11 pr-10 text-sm text-foreground placeholder:text-muted-foreground shadow-sm focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/15 dark:bg-white/5 dark:text-white dark:placeholder:text-white/50"
      />
      <button
        type="button"
        aria-label="Clear search"
        onClick={() => setValue("")}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground/70 transition hover:text-foreground dark:text-white/50 dark:hover:text-white"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
