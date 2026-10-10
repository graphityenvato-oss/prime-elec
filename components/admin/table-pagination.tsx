"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationNumbers,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function TablePagination({
  totalRows,
  page,
  pageSize,
  onPageChange,
}: {
  totalRows: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}) {
  if (!totalRows) return null;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  return (
    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-xs text-muted-foreground" role="status">
        Showing {(currentPage - 1) * pageSize + 1}–
        {Math.min(currentPage * pageSize, totalRows)} of {totalRows}
      </span>
      {totalPages > 1 ? (
        <Pagination className="sm:mx-0 sm:w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                aria-disabled={currentPage === 1}
                tabIndex={currentPage === 1 ? -1 : undefined}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-40" : ""
                }
                onClick={(event) => {
                  event.preventDefault();
                  if (currentPage > 1) onPageChange(currentPage - 1);
                }}
              />
            </PaginationItem>
            <PaginationNumbers
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={onPageChange}
            />
            <PaginationItem>
              <PaginationNext
                href="#"
                aria-disabled={currentPage === totalPages}
                tabIndex={currentPage === totalPages ? -1 : undefined}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-40"
                    : ""
                }
                onClick={(event) => {
                  event.preventDefault();
                  if (currentPage < totalPages) onPageChange(currentPage + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : null}
    </div>
  );
}
