"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type CategoryOption = {
  id: string;
  name: string;
  slug: string;
  industries: string[] | null;
};
type Options = {
  categories: CategoryOption[];
  brands: Array<{ id: string; name: string }>;
  industries: Array<{ id: string; name: string }>;
};

const slugify = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function ImageField({ name, label }: { name: string; label: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) { setPreview(null); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div className="grid gap-2">
      <label htmlFor={`category-${name}`} className="text-sm font-medium">{label}</label>
      <Input id={`category-${name}`} name={name} type="file" required accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => {
        const selected = event.target.files?.[0] ?? null;
        setError(null);
        setFile(null);
        if (selected && (!/\.(jpg|jpeg|png|webp|gif)$/i.test(selected.name) || !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(selected.type))) {
          setError("Choose a JPG, PNG, WEBP, or GIF image.");
          event.target.value = "";
          return;
        }
        if (selected && selected.size > 3 * 1024 * 1024) {
          setError("Image must be 3 MB or smaller.");
          event.target.value = "";
          return;
        }
        setFile(selected);
      }} />
      <p className="text-xs text-muted-foreground">JPG, PNG, WEBP, or GIF. Maximum 3 MB.</p>
      {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
      {preview ? (
        <div className="relative h-36 overflow-hidden rounded-xl border">
          <Image src={preview} alt={`${label} preview`} fill unoptimized className="object-contain" />
        </div>
      ) : null}
    </div>
  );
}

export function AddCategoryDialog({ token, disabled, onCreated }: {
  token: string | null;
  disabled?: boolean;
  onCreated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [options, setOptions] = useState<Options | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [optionError, setOptionError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (!open || !token) return;
    let active = true;
    setLoading(true);
    setOptionError(null);
    fetch("/api/admin/categories", { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Failed to load form options.");
        if (active) setOptions(result as Options);
      })
      .catch((err) => {
        if (active) setOptionError(err instanceof Error ? err.message : "Failed to load form options.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [open, token, retry]);

  const existingCategory = options?.categories.find((category) => category.slug === slugify(categoryName));

  return (
    <>
      <Button className="rounded-full" disabled={disabled || !token} onClick={() => {
        setCategoryName("");
        setOptions(null);
        setError(null);
        setOpen(true);
      }}>Add Category</Button>
      <Dialog open={open} onOpenChange={(next) => { if (!saving) setOpen(next); }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader><DialogTitle>Add category item</DialogTitle></DialogHeader>
          {loading ? <p className="text-sm text-muted-foreground" role="status">Loading form...</p> : optionError ? (
            <div className="grid gap-3">
              <p role="alert" className="text-sm text-destructive">{optionError}</p>
              <Button variant="outline" onClick={() => setRetry((value) => value + 1)}>Retry</Button>
            </div>
          ) : options ? (
            <form className="grid gap-4" onSubmit={async (event) => {
              event.preventDefault();
              if (!token || saving) return;
              const form = new FormData(event.currentTarget);
              setError(null);
              if (!existingCategory && !form.getAll("industryIds").length) {
                setError("Select at least one industry for the new category.");
                return;
              }
              setSaving(true);
              try {
                const response = await fetch("/api/admin/categories", {
                  method: "POST", headers: { Authorization: `Bearer ${token}` }, body: form,
                });
                const result = await response.json();
                if (!response.ok) throw new Error(result.message || "Failed to save category item.");
                setOpen(false);
                onCreated();
              } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to save category item.");
              } finally { setSaving(false); }
            }}>
              {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
              <fieldset disabled={saving} className="grid gap-4">
                <div className="grid gap-2">
                  <label htmlFor="catalog-category-name" className="text-sm font-medium">Category name</label>
                  <Input id="catalog-category-name" name="categoryName" list="catalog-category-options" required value={categoryName} onChange={(event) => setCategoryName(event.target.value)} placeholder="Choose an existing category or enter a new name" />
                  <datalist id="catalog-category-options">{options.categories.map((category) => <option key={category.id} value={category.name} />)}</datalist>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="catalog-brand-name" className="text-sm font-medium">Brand name</label>
                  <Input id="catalog-brand-name" name="brandName" list="catalog-brand-options" required placeholder="Choose an existing brand or enter a new name" />
                  <datalist id="catalog-brand-options">{options.brands.map((brand) => <option key={brand.id} value={brand.name} />)}</datalist>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="catalog-subcategory-name" className="text-sm font-medium">Subcategory name</label>
                  <Input id="catalog-subcategory-name" name="subcategoryName" required placeholder="e.g. Circuit Breakers" />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="catalog-page-url" className="text-sm font-medium">Page URL</label>
                  <Input id="catalog-page-url" name="pageUrl" type="url" required placeholder="https://example.com/products" />
                </div>
                <ImageField name="image" label="Subcategory image" />
                {existingCategory ? (
                  <p className="rounded-xl border bg-muted/10 p-3 text-sm text-muted-foreground">
                    Using {existingCategory.name}&apos;s existing main image and industries.
                  </p>
                ) : (
                  <>
                    <ImageField name="mainImage" label="Main category image" />
                    <fieldset className="grid gap-2 rounded-xl border p-3">
                      <legend className="px-1 text-sm font-medium">Industries</legend>
                      <p className="text-xs text-muted-foreground">Select at least one industry for the new category.</p>
                      {options.industries.length ? options.industries.map((industry) => (
                        <label key={industry.id} className="flex items-center gap-2 text-sm">
                          <input type="checkbox" name="industryIds" value={industry.id} className="size-4" />
                          {industry.name}
                        </label>
                      )) : <p className="text-sm text-muted-foreground">Add an industry in Admin → Industries first, then reopen this form.</p>}
                    </fieldset>
                  </>
                )}
              </fieldset>
              <DialogFooter>
                <Button type="button" variant="outline" disabled={saving} onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" className="rounded-full" disabled={saving || (!existingCategory && !options.industries.length)}>{saving ? "Saving..." : "Add Category"}</Button>
              </DialogFooter>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
