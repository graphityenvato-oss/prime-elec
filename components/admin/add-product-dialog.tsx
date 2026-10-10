"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getStockProductOptions,
  type StockProductOptionRow,
} from "@/lib/stock-product-options";

type Tag = { id: number; label: string; value: string };

function DatabaseSelect({
  id,
  name,
  value,
  onValueChange,
  options,
  placeholder,
  disabled,
  required,
}: {
  id: string;
  name?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
  placeholder: string;
  disabled?: boolean;
  required?: boolean;
}) {
  return (
    <Select
      name={name}
      value={value}
      onValueChange={onValueChange}
      disabled={disabled || !options.length}
      required={required}
    >
      <SelectTrigger id={id} className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent position="popper">
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function StockImageField({
  name,
  label,
  multiple = false,
}: {
  name: string;
  label: string;
  multiple?: boolean;
}) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  return (
    <div className="grid gap-2">
      <label htmlFor={`stock-${name}`} className="text-sm font-medium">
        {label}
      </label>
      <Input
        id={`stock-${name}`}
        name={name}
        type="file"
        multiple={multiple}
        required
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={(event) => {
          const selected = Array.from(event.target.files ?? []);
          setPreviews([]);
          setError(null);
          const invalid = selected.some(
            (file) =>
              !file.size ||
              !/\.(jpg|jpeg|png|webp|gif)$/i.test(file.name) ||
              !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
                file.type,
              ),
          );
          if (
            invalid ||
            selected.some((file) => file.size > 3 * 1024 * 1024) ||
            selected.length > 10
          ) {
            setError(
              invalid
                ? "Choose JPG, PNG, WEBP, or GIF images."
                : selected.length > 10
                  ? "Choose up to 10 images."
                  : "Each image must be 3 MB or smaller.",
            );
            event.target.value = "";
            return;
          }
          setPreviews(selected.map((file) => URL.createObjectURL(file)));
        }}
      />
      <p className="text-xs text-muted-foreground">
        JPG, PNG, WEBP, or GIF. Maximum 3 MB per image.
        {multiple ? " Select up to 10 images." : ""}
      </p>
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      {previews.length ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {previews.map((url, index) => (
            <div
              key={url}
              className="relative h-28 overflow-hidden rounded-xl border"
            >
              <Image
                src={url}
                alt={`${label} preview ${index + 1}`}
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function AddProductDialog({
  token,
  rows,
  disabled,
  onCreated,
}: {
  token: string | null;
  rows: StockProductOptionRow[];
  disabled?: boolean;
  onCreated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const suggestions = useMemo(
    () => getStockProductOptions(rows, brand, category),
    [rows, brand, category],
  );

  const updateTag = (id: number, key: "label" | "value", value: string) =>
    setTags((current) =>
      current.map((tag) => (tag.id === id ? { ...tag, [key]: value } : tag)),
    );

  return (
    <>
      <Button
        className="rounded-full"
        disabled={disabled || !token}
        onClick={() => {
          setBrand("");
          setCategory("");
          setSubcategory("");
          setTags([]);
          setError(null);
          setOpen(true);
        }}
      >
        Add Product
      </Button>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (!saving) setOpen(next);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add stock product</DialogTitle>
          </DialogHeader>
          <form
            className="grid gap-4"
            onSubmit={async (event) => {
              event.preventDefault();
              if (!token || saving) return;
              setError(null);
              if (!brand || !category || !subcategory) {
                setError(
                  "Choose an existing brand, category, and subcategory.",
                );
                return;
              }
              const filledTags = tags.filter(
                (tag) => tag.label.trim() || tag.value.trim(),
              );
              if (
                filledTags.some((tag) => !tag.label.trim() || !tag.value.trim())
              ) {
                setError(
                  "Fill both the name and value for each tag, or remove it.",
                );
                return;
              }
              const labels = filledTags.map((tag) =>
                tag.label.trim().toLowerCase(),
              );
              if (new Set(labels).size !== labels.length) {
                setError("Each specification tag name must be unique.");
                return;
              }
              const form = new FormData(event.currentTarget);
              form.set("brand", brand);
              form.set("category", category);
              form.set("subcategory", subcategory);
              form.set(
                "tags",
                JSON.stringify(
                  filledTags.map((tag) => ({
                    label: tag.label.trim(),
                    value: tag.value.trim(),
                  })),
                ),
              );
              setSaving(true);
              try {
                const response = await fetch("/api/admin/products", {
                  method: "POST",
                  headers: { Authorization: `Bearer ${token}` },
                  body: form,
                });
                const result = await response.json();
                if (!response.ok)
                  throw new Error(result.message || "Failed to save product.");
                setOpen(false);
                onCreated();
              } catch (err) {
                setError(
                  err instanceof Error
                    ? err.message
                    : "Failed to save product.",
                );
              } finally {
                setSaving(false);
              }
            }}
          >
            {error ? (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            ) : null}
            <fieldset disabled={saving} className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <label htmlFor="stock-brand" className="text-sm font-medium">
                    Brand
                  </label>
                  <DatabaseSelect
                    id="stock-brand"
                    name="brand"
                    required
                    value={brand}
                    options={suggestions.brands}
                    placeholder="Choose a brand"
                    disabled={saving}
                    onValueChange={(value) => {
                      setBrand(value);
                      setCategory("");
                      setSubcategory("");
                    }}
                  />
                </div>
                <div className="grid gap-2">
                  <label
                    htmlFor="stock-category"
                    className="text-sm font-medium"
                  >
                    Category
                  </label>
                  <DatabaseSelect
                    id="stock-category"
                    name="category"
                    required
                    value={category}
                    options={suggestions.categories}
                    placeholder="Choose a category"
                    disabled={saving || !brand}
                    onValueChange={(value) => {
                      setCategory(value);
                      setSubcategory("");
                    }}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <label
                  htmlFor="stock-subcategory"
                  className="text-sm font-medium"
                >
                  Subcategory
                </label>
                <DatabaseSelect
                  id="stock-subcategory"
                  name="subcategory"
                  required
                  value={subcategory}
                  options={suggestions.subcategories}
                  placeholder="Choose a subcategory"
                  disabled={saving || !category}
                  onValueChange={(value) => {
                    setSubcategory(value);
                  }}
                />
                {!suggestions.brands.length ? (
                  <p className="text-sm text-muted-foreground">
                    No stock categories are available. Import stock first to
                    populate the dropdowns.
                  </p>
                ) : null}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <label htmlFor="stock-order" className="text-sm font-medium">
                    Order number
                  </label>
                  <Input id="stock-order" name="orderNo" required />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="stock-code" className="text-sm font-medium">
                    Code / product title
                  </label>
                  <Input id="stock-code" name="code" required />
                </div>
              </div>
              <div className="grid gap-2">
                <label
                  htmlFor="stock-description"
                  className="text-sm font-medium"
                >
                  Description
                </label>
                <Textarea
                  id="stock-description"
                  name="description"
                  required
                  rows={3}
                />
              </div>
              <StockImageField
                name="categoryImages"
                label="Category images"
                multiple
              />
              <StockImageField
                name="productImage"
                label="Product / subcategory image"
              />
              <fieldset className="grid gap-3 rounded-xl border p-4">
                <legend className="px-1 text-sm font-medium">
                  Specification tags (optional)
                </legend>
                <p className="text-xs text-muted-foreground">
                  Enter any tag name and value, such as Voltage: 415V or Color:
                  Red.
                </p>
                {tags.map((tag, index) => (
                  <div
                    key={tag.id}
                    className="grid gap-2 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
                  >
                    <div className="grid gap-1">
                      <label
                        htmlFor={`stock-tag-name-${tag.id}`}
                        className="text-xs text-muted-foreground"
                      >
                        Tag name
                      </label>
                      <Input
                        id={`stock-tag-name-${tag.id}`}
                        value={tag.label}
                        placeholder="e.g. Voltage"
                        onChange={(event) =>
                          updateTag(tag.id, "label", event.target.value)
                        }
                      />
                    </div>
                    <div className="grid gap-1">
                      <label
                        htmlFor={`stock-tag-value-${tag.id}`}
                        className="text-xs text-muted-foreground"
                      >
                        Value
                      </label>
                      <Input
                        id={`stock-tag-value-${tag.id}`}
                        value={tag.value}
                        placeholder="e.g. 415V"
                        onChange={(event) =>
                          updateTag(tag.id, "value", event.target.value)
                        }
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      aria-label={`Remove tag ${index + 1}`}
                      onClick={() =>
                        setTags((current) =>
                          current.filter((item) => item.id !== tag.id),
                        )
                      }
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="justify-self-start rounded-full"
                  disabled={saving || tags.length >= 100}
                  onClick={() =>
                    setTags((current) => [
                      ...current,
                      {
                        id: Math.max(-1, ...current.map((tag) => tag.id)) + 1,
                        label: "",
                        value: "",
                      },
                    ])
                  }
                >
                  Add Tag
                </Button>
                {tags.some((tag) => tag.label.trim() && tag.value.trim()) ? (
                  <div
                    className="flex flex-wrap gap-2"
                    aria-label="Tag preview"
                  >
                    {tags
                      .filter((tag) => tag.label.trim() && tag.value.trim())
                      .map((tag) => (
                        <span
                          key={tag.id}
                          className="rounded-full border bg-muted/30 px-3 py-1 text-xs font-semibold"
                        >
                          {tag.label.trim()}: {tag.value.trim()}
                        </span>
                      ))}
                  </div>
                ) : null}
              </fieldset>
            </fieldset>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={saving}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-full"
                disabled={saving || !brand || !category || !subcategory}
              >
                {saving ? "Saving..." : "Add Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
