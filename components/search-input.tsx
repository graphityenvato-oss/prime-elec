"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

type SearchInputProps = {
  placeholder: string;
  className?: string;
  value?: string;
  onValueChange?: (value: string) => void;
};

export function SearchInput({
  placeholder,
  className,
  value,
  onValueChange,
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState("");
  const currentValue = value ?? internalValue;
  const setValue = onValueChange ?? setInternalValue;

  return (
    <div className={`relative ${className ?? ""}`}>
      <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground dark:text-white/60" />
      <input
        type="text"
        inputMode="search"
        enterKeyHint="search"
        value={currentValue}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-border/60 bg-white/90 py-2 pl-11 pr-10 text-sm text-foreground placeholder:text-muted-foreground shadow-sm focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/15 dark:bg-white/5 dark:text-white dark:placeholder:text-white/50"
      />
      <button
        type="button"
        aria-label="Clear search"
        onClick={() => setValue("")}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-primary/60 p-1 text-primary/80 transition hover:border-primary hover:text-primary dark:border-white/40 dark:text-white/70 dark:hover:border-white dark:hover:text-white"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
