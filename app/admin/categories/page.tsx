"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PrimeCard } from "@/components/ui/prime-card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationNumbers,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { supabaseClient } from "@/lib/supabase/client";
import { ActionsMenu } from "@/components/admin/actions-menu";

type SubcategoryRow = {
  id: string;
  name: string;
  slug: string;
  page_url: string;
  image_url: string;
  category: { name: string; slug: string } | null;
  brand: { name: string; slug: string } | null;
};

export default function AdminCategoriesPage() {
  const [checked, setChecked] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [rows, setRows] = useState<SubcategoryRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [activeEdit, setActiveEdit] = useState<SubcategoryRow | null>(null);
  const [editCategory, setEditCategory] = useState("");
  const [editBrand, setEditBrand] = useState("");
  const [editName, setEditName] = useState("");
  const [editPageUrl, setEditPageUrl] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const pageSize = 20;
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      const { data } = await supabaseClient.auth.getSession();
      const sessionToken = data.session?.access_token ?? null;
      if (!sessionToken) {
        router.replace("/ns-admin");
        return;
      }

      if (isMounted) {
        setToken(sessionToken);
        setChecked(true);
      }
    };

    loadSession();

    return () => {
      isMounted = false;
    };
  }, [router]);

  useEffect(() => {
    if (!token) return;
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetch("/api/admin/categories/list", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        if (response.status === 401) {
          router.replace("/ns-admin");
          return [];
        }
        if (!response.ok) {
          throw new Error("Failed to load categories.");
        }
        const result = (await response.json().catch(() => ({}))) as {
          rows?: SubcategoryRow[];
        };
        return result.rows ?? [];
      })
      .then((data) => {
        if (isMounted) {
          setRows(data);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [router, token]);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((row) => {
      const category = row.category?.name?.toLowerCase() ?? "";
      const brand = row.brand?.name?.toLowerCase() ?? "";
      const subcategory = row.name.toLowerCase();
      return (
        category.includes(query) ||
        brand.includes(query) ||
        subcategory.includes(query)
      );
    });
  }, [rows, search]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const pageRows = filteredRows.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  useEffect(() => {
    setPage(1);
  }, [search]);

  if (!checked) {
    return null;
  }

  return (
    <>
      <section>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Categories
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Categories
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          View the imported catalog categories, brands, and subcategories.
        </p>
      </section>

      <PrimeCard className="mt-6 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Input
            placeholder="Search category, brand, or subcategory"
            className="w-full sm:max-w-md"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => router.push("/admin/categories/import")}
          >
            Import Categories
          </Button>
        </div>

        <div className="mt-6">
          {error ? (
            <div className="mb-4 rounded-2xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          ) : null}

          <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Subcategory</TableHead>
                  <TableHead>Page URL</TableHead>
                  <TableHead>Image URL</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-sm">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : pageRows.length ? (
                pageRows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium">
                        {row.category?.name ?? "-"}
                      </TableCell>
                      <TableCell>{row.brand?.name ?? "-"}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell className="max-w-60 truncate">
                        {row.page_url}
                      </TableCell>
                      <TableCell className="max-w-50 truncate">
                        {row.image_url}
                      </TableCell>
                      <TableCell className="text-right">
                        <ActionsMenu
                          onEdit={() => {
                            setActiveEdit(row);
                            setEditCategory(row.category?.name ?? "");
                            setEditBrand(row.brand?.name ?? "");
                            setEditName(row.name);
                            setEditPageUrl(row.page_url);
                            setEditImageUrl(row.image_url);
                            setEditError(null);
                          }}
                          onDelete={async () => {
                            if (!token) return;
                            const response = await fetch(
                              `/api/admin/categories/${row.id}`,
                              {
                                method: "DELETE",
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                },
                              },
                            );
                            if (!response.ok) {
                              setError("Failed to delete category.");
                              return;
                            }
                            setRows((current) =>
                              current.filter((item) => item.id !== row.id),
                            );
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-sm">
                      No rows found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

          {filteredRows.length > pageSize ? (
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs text-muted-foreground">
                Showing {(page - 1) * pageSize + 1}-
                {Math.min(page * pageSize, filteredRows.length)} of{" "}
                {filteredRows.length}
              </span>
              <Pagination className="sm:mx-0 sm:w-auto">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#top"
                      className={page === 1 ? "pointer-events-none opacity-40" : ""}
                      onClick={(event) => {
                        event.preventDefault();
                        setPage((prev) => Math.max(1, prev - 1));
                      }}
                    />
                  </PaginationItem>
                  <PaginationNumbers
                    totalPages={totalPages}
                    currentPage={page}
                    onPageChange={setPage}
                  />
                  <PaginationItem>
                    <PaginationNext
                      href="#top"
                      className={
                        page >= totalPages ? "pointer-events-none opacity-40" : ""
                      }
                      onClick={(event) => {
                        event.preventDefault();
                        setPage((prev) => Math.min(totalPages, prev + 1));
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          ) : null}
        </div>
      </PrimeCard>

      <Dialog open={Boolean(activeEdit)} onOpenChange={() => setActiveEdit(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit category item</DialogTitle>
          </DialogHeader>
          {editError ? (
            <div className="rounded-2xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {editError}
            </div>
          ) : null}
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Category
              </label>
              <Input value={editCategory} onChange={(e) => setEditCategory(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Brand
              </label>
              <Input value={editBrand} onChange={(e) => setEditBrand(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Subcategory
              </label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Page URL
              </label>
              <Input value={editPageUrl} onChange={(e) => setEditPageUrl(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Image URL
              </label>
              <Input value={editImageUrl} onChange={(e) => setEditImageUrl(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setActiveEdit(null)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              className="rounded-full"
              disabled={isSaving}
              onClick={async () => {
                if (!activeEdit || !token) return;
                setIsSaving(true);
                setEditError(null);
                const response = await fetch(
                  `/api/admin/categories/${activeEdit.id}`,
                  {
                    method: "PATCH",
                    headers: {
                      Authorization: `Bearer ${token}`,
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      categoryName: editCategory,
                      brandName: editBrand,
                      subcategoryName: editName,
                      pageUrl: editPageUrl,
                      imageUrl: editImageUrl,
                    }),
                  },
                );
                if (!response.ok) {
                  const result = await response.json().catch(() => ({}));
                  setEditError(result?.message || "Failed to update.");
                  setIsSaving(false);
                  return;
                }
                const updated = await response.json().catch(() => null);
                setRows((current) =>
                  current.map((item) =>
                    item.id === activeEdit.id
                      ? {
                          ...item,
                          name: updated?.subcategory?.name ?? editName,
                          page_url: updated?.subcategory?.page_url ?? editPageUrl,
                          image_url: updated?.subcategory?.image_url ?? editImageUrl,
                          category: {
                            name: updated?.category?.name ?? editCategory,
                            slug: updated?.category?.slug ?? item.category?.slug ?? "",
                          },
                          brand: {
                            name: updated?.brand?.name ?? editBrand,
                            slug: updated?.brand?.slug ?? item.brand?.slug ?? "",
                          },
                        }
                      : item,
                  ),
                );
                setIsSaving(false);
                setActiveEdit(null);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
