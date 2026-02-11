"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ConfirmationAlert } from "@/components/ui/confirmation-alert";
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
import { supabaseClient } from "@/lib/supabase/client";
import { ActionsMenu } from "@/components/admin/actions-menu";

type IndustryRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
};

export default function AdminIndustriesPage() {
  const [checked, setChecked] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [rows, setRows] = useState<IndustryRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeEdit, setActiveEdit] = useState<IndustryRow | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [clearMessage, setClearMessage] = useState<string | null>(null);
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

    fetch("/api/admin/industries/list", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        if (response.status === 401) {
          router.replace("/ns-admin");
          return [];
        }
        if (!response.ok) {
          throw new Error("Failed to load industries.");
        }
        const result = (await response.json().catch(() => ({}))) as {
          rows?: IndustryRow[];
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
      return (
        row.name.toLowerCase().includes(query) ||
        row.description.toLowerCase().includes(query)
      );
    });
  }, [rows, search]);

  if (!checked) {
    return null;
  }

  return (
    <>
      <section>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Industries
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Industries
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage the industries list and descriptions shown on the website.
        </p>
      </section>

      <PrimeCard className="mt-6 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Input
            placeholder="Search industries"
            className="w-full sm:max-w-md"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => router.push("/admin/industries/import")}
            >
              Import Industries
            </Button>
            <ConfirmationAlert
              title="Clear all industries?"
              description="This will permanently remove all industries and their images."
              confirmLabel={isClearing ? "Clearing..." : "Clear Industries"}
              cancelLabel="Cancel"
              onConfirm={async () => {
                if (!token) return;
                setIsClearing(true);
                setClearMessage(null);
                try {
                  const response = await fetch("/api/admin/industries/clear", {
                    method: "POST",
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  });
                  const result = (await response.json().catch(() => ({}))) as {
                    message?: string;
                  };
                  if (!response.ok) {
                    throw new Error(
                      result.message || "Failed to clear industries.",
                    );
                  }
                  setRows([]);
                  setClearMessage(
                    result.message || "Industries cleared successfully.",
                  );
                } catch (err) {
                  setClearMessage(
                    err instanceof Error
                      ? err.message
                      : "Failed to clear industries.",
                  );
                } finally {
                  setIsClearing(false);
                }
              }}
            >
              <Button
                variant="destructive"
                className="rounded-full"
                disabled={isClearing || loading}
              >
                Clear Industries
              </Button>
            </ConfirmationAlert>
          </div>
        </div>

        <div className="mt-6">
          {clearMessage ? (
            <div className="mb-4 rounded-2xl border border-border/60 bg-muted/10 px-4 py-3 text-sm text-foreground">
              {clearMessage}
            </div>
          ) : null}
          {error ? (
            <div className="mb-4 rounded-2xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          ) : null}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Industry</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Image URL</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-sm">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredRows.length ? (
                filteredRows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell className="max-w-96 truncate">
                      {row.description}
                    </TableCell>
                    <TableCell className="max-w-60 truncate">
                      {row.image_url}
                    </TableCell>
                    <TableCell className="text-right">
                      <ActionsMenu
                        onEdit={() => {
                          setActiveEdit(row);
                          setEditName(row.name);
                          setEditDescription(row.description);
                          setEditImageUrl(row.image_url);
                          setEditError(null);
                        }}
                        onDelete={async () => {
                          if (!token) return;
                          const response = await fetch(
                            `/api/admin/industries/${row.id}`,
                            {
                              method: "DELETE",
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },
                            },
                          );
                          if (!response.ok) {
                            setError("Failed to delete industry.");
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
                  <TableCell colSpan={4} className="text-center text-sm">
                    No industries found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </PrimeCard>

      <Dialog
        open={Boolean(activeEdit)}
        onOpenChange={() => setActiveEdit(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit industry</DialogTitle>
          </DialogHeader>
          {editError ? (
            <div className="rounded-2xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {editError}
            </div>
          ) : null}
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Industry
              </label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Description
              </label>
              <Input
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Image URL
              </label>
              <Input
                value={editImageUrl}
                onChange={(e) => setEditImageUrl(e.target.value)}
              />
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
                  `/api/admin/industries/${activeEdit.id}`,
                  {
                    method: "PATCH",
                    headers: {
                      Authorization: `Bearer ${token}`,
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      name: editName,
                      description: editDescription,
                      image_url: editImageUrl,
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
                          name: updated?.industry?.name ?? editName,
                          slug: updated?.industry?.slug ?? item.slug,
                          description:
                            updated?.industry?.description ?? editDescription,
                          image_url:
                            updated?.industry?.image_url ?? editImageUrl,
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
