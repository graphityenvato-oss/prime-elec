import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import type Lenis from "@studio-freight/lenis";

import { cn } from "@/lib/utils";
import { buttonVariants, type Button } from "@/components/ui/button";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">;

function PaginationLink({
  className,
  isActive,
  size = "icon",
  onClick,
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        if (typeof window !== "undefined") {
          const lenis = (window as { __lenis?: Lenis }).__lenis;
          if (lenis) {
            lenis.stop();
            lenis.scrollTo(0, {
              duration: 0.85,
              lock: true,
              force: true,
              onComplete: () => lenis.start(),
            });
          } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }
      }}
      {...props}
    />
  );
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon />
    </PaginationLink>
  );
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

type PaginationNumbersProps = {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

function getPageItems(totalPages: number, currentPage: number) {
  const items: Array<number | "ellipsis"> = [];

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i += 1) items.push(i);
    return items;
  }

  items.push(1);

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) items.push("ellipsis");
  for (let i = start; i <= end; i += 1) items.push(i);
  if (end < totalPages - 1) items.push("ellipsis");

  items.push(totalPages);
  return items;
}

function PaginationNumbers({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationNumbersProps) {
  const items = getPageItems(totalPages, currentPage);
  return (
    <>
      {items.map((item, index) =>
        item === "ellipsis" ? (
          <PaginationItem key={`ellipsis-${index}`}>
            <PaginationEllipsis />
          </PaginationItem>
        ) : (
          <PaginationItem key={item}>
            <PaginationLink
              href="#top"
              isActive={item === currentPage}
              onClick={(event) => {
                event.preventDefault();
                onPageChange(item);
              }}
            >
              {item}
            </PaginationLink>
          </PaginationItem>
        ),
      )}
    </>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationNumbers,
};
