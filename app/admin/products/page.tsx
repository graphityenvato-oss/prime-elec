"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PrimeCard } from "@/components/ui/prime-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabaseClient } from "@/lib/supabase/client";

type ProductRow = {
  id: string;
  brand: string;
  category: string;
  subcategory: string;
  order_no: string;
  code: string;
  title: string;
  description: string;
  created_at: string;
};

type Summary = {
  products: number;
  brands: number;
  categories: number;
  subcategories: number;
};

export default function AdminProductsPage() {
  const [checked, setChecked] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
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
    void loadSession();
    return () => {
      isMounted = false;
    };
  }, [router]);

  useEffect(() => {
    if (!token) return;
    let isMounted = true;
    const run = async () => {
      await Promise.resolve();
      if (!isMounted) return;
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/admin/products/list", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 401) {
          router.replace("/ns-admin");
          return;
        }
        if (!response.ok) {
          throw new Error("Failed to load stock products.");
        }
        const result = (await response.json().catch(() => ({}))) as {
          rows?: ProductRow[];
          summary?: Summary;
        };
        if (!isMounted) return;
        setRows(result.rows ?? []);
        setSummary(result.summary ?? null);
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void run();

    return () => {
      isMounted = false;
    };
  }, [router, token]);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((row) =>
      [
        row.brand,
        row.category,
        row.subcategory,
        row.order_no,
        row.code,
        row.title,
        row.description,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [rows, search]);

  if (!checked) return null;

  return (
    <>
      <section>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Stock
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Stock Products
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          View and search imported stock products.
        </p>
      </section>

      <PrimeCard className="mt-6 p-6">
        {summary ? (
          <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-border/60 bg-muted/10 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Products
              </p>
              <p className="mt-2 text-2xl font-bold">{summary.products}</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-muted/10 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Brands
              </p>
              <p className="mt-2 text-2xl font-bold">{summary.brands}</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-muted/10 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Categories
              </p>
              <p className="mt-2 text-2xl font-bold">{summary.categories}</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-muted/10 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Sub-Categories
              </p>
              <p className="mt-2 text-2xl font-bold">{summary.subcategories}</p>
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Input
            placeholder="Search stock products"
            className="w-full sm:max-w-md"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => router.push("/admin/products/import")}
          >
            Import Stock
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
                <TableHead>Brand</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Sub-Category</TableHead>
                <TableHead>Order#</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-sm">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredRows.length ? (
                filteredRows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.brand}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell>{row.subcategory}</TableCell>
                    <TableCell>{row.order_no}</TableCell>
                    <TableCell>{row.code}</TableCell>
                    <TableCell className="max-w-80 truncate">
                      {row.description}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-sm">
                    No stock products found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </PrimeCard>
    </>
  );
}
