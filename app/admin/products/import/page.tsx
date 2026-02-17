"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import JSZip from "jszip";

import { Button } from "@/components/ui/button";
import { ConfirmationAlert } from "@/components/ui/confirmation-alert";
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

type StockRow = {
  brand: string;
  category: string;
  category_image_urls: string[];
  subcategory: string;
  subcategory_image_url: string;
  order_no: string;
  code: string;
  description: string;
  details: Record<string, string>;
};

export default function AdminProductsImportPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [checked, setChecked] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [rows, setRows] = useState<StockRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Array<{ row: number; field: string; message: string }>
  >([]);
  const [validated, setValidated] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [zipError, setZipError] = useState<string | null>(null);
  const [zipEntries, setZipEntries] = useState<
    Array<{ name: string; key: string; size: number; file: File }>
  >([]);
  const [zipOversize, setZipOversize] = useState<string[]>([]);
  const [zipUploadMessage, setZipUploadMessage] = useState<string | null>(null);
  const [zipUploadFailures, setZipUploadFailures] = useState<string[]>([]);
  const [missingImages, setMissingImages] = useState<string[]>([]);
  const [isUploadingZip, setIsUploadingZip] = useState(false);
  const [uploadedImageMap, setUploadedImageMap] = useState<Map<string, string>>(
    new Map(),
  );
  const [importLocked, setImportLocked] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);
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

  const handlePickFile = () => {
    fileInputRef.current?.click();
  };

  const handlePickZip = () => {
    zipInputRef.current?.click();
  };

  const normalizeFilename = (value: string) =>
    value.replace(/\\/g, "/").split("/").pop()?.trim() ?? "";

  const stripExtension = (value: string) => value.replace(/\.[^.]+$/, "");

  const getExtension = (value: string) => {
    const match = value.toLowerCase().match(/\.[a-z0-9]+$/);
    return match ? match[0] : "";
  };

  const slugifyName = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const getMatchKey = useCallback((value: string) => {
    const base = stripExtension(normalizeFilename(value));
    const normalized = base
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
    return normalized
      .replace(/\bmin\b$/i, "")
      .replace(/\s+/g, " ")
      .trim();
  }, []);

  const getSafeFilename = (value: string) => {
    const base = stripExtension(normalizeFilename(value));
    const ext = getExtension(value) || ".webp";
    const slug = slugifyName(base) || "image";
    return `${slug}${ext}`;
  };

  const allowedImageExt = /\.(jpg|jpeg|png|webp|gif)$/i;
  const maxImageSize = 3 * 1024 * 1024;

  const parseExcel = async (file: File) => {
    setError(null);
    setValidated(false);
    setValidationErrors([]);
    setImportLocked(false);

    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    if (!sheet) {
      setRows([]);
      setError("Sheet not found.");
      return;
    }

    const matrix = XLSX.utils.sheet_to_json<Array<string | number | boolean>>(
      sheet,
      { header: 1, defval: "" },
    );

    if (!matrix.length) {
      setRows([]);
      setError("No rows found in sheet.");
      return;
    }

    const headers = matrix[0].map((value) => String(value).trim());
    const normalized = headers.map((value) => value.toLowerCase());
    const indexOf = (key: string) => normalized.indexOf(key.toLowerCase());
    const indexOfAny = (keys: string[]) =>
      keys.map((key) => indexOf(key)).find((value) => value !== -1) ?? -1;

    const required = {
      brand: indexOfAny(["Brand"]),
      category: indexOfAny(["Category"]),
      categoryImage: indexOfAny(["Category Image"]),
      subcategory: indexOfAny(["Sub-Category", "Sub-category"]),
      subcategoryImage: indexOfAny([
        "Sub-Category Image",
        "Sub-category Image",
      ]),
      orderNo: indexOfAny(["Order#", "Order No#"]),
      code: indexOfAny(["Code"]),
      description: indexOfAny(["Description"]),
    };

    const missing = Object.entries(required)
      .filter(([, idx]) => idx === -1)
      .map(([key]) => key);
    if (missing.length) {
      setRows([]);
      setError(`Missing columns: ${missing.join(", ")}`);
      return;
    }

    const detailIndexes = headers
      .map((header, idx) => ({ header, idx }))
      .filter(({ idx }) => idx > required.description);

    const parseCategoryImages = (value: string): string[] => {
      const trimmed = value.trim();
      if (!trimmed) return [];
      if (/^https?:\/\//i.test(trimmed)) return [trimmed];

      const normalizedPath = trimmed.replace(/\\/g, "/");
      if (normalizedPath.toLowerCase().startsWith("images/")) {
        const rest = normalizedPath.slice("images/".length);
        const names = rest
          .split("/")
          .map((part) => part.trim())
          .filter(Boolean);
        return names.map((name) => `images/${name}`);
      }

      return [normalizedPath];
    };

    const parsed = matrix
      .slice(1)
      .map((row) => {
        const details: Record<string, string> = {};
        for (const item of detailIndexes) {
          const value = String(row[item.idx] ?? "").trim();
          if (value) {
            details[item.header] = value;
          }
        }

        return {
          brand: String(row[required.brand] ?? "").trim(),
          category: String(row[required.category] ?? "").trim(),
          category_image_urls: parseCategoryImages(
            String(row[required.categoryImage] ?? ""),
          ),
          subcategory: String(row[required.subcategory] ?? "").trim(),
          subcategory_image_url: String(
            row[required.subcategoryImage] ?? "",
          ).trim(),
          order_no: String(row[required.orderNo] ?? "").trim(),
          code: String(row[required.code] ?? "").trim(),
          description: String(row[required.description] ?? "").trim(),
          details,
        };
      })
      .filter(
        (row) =>
          row.brand ||
          row.category ||
          row.subcategory ||
          row.order_no ||
          row.code ||
          row.description,
      );

    setRows(parsed);
    runValidation(parsed);
  };

  const parseZip = async (file: File) => {
    setZipError(null);
    setZipOversize([]);
    setZipUploadMessage(null);
    setUploadedImageMap(new Map());
    setImportLocked(false);

    try {
      const zip = await JSZip.loadAsync(file);
      const entries: Array<{
        name: string;
        key: string;
        size: number;
        file: File;
      }> = [];
      const oversize: string[] = [];

      const files = Object.values(zip.files).filter((entry) => !entry.dir);

      for (const entry of files) {
        const baseName = normalizeFilename(entry.name);
        if (!allowedImageExt.test(baseName.toLowerCase())) {
          continue;
        }

        const arrayBuffer = await entry.async("arraybuffer");
        const size = arrayBuffer.byteLength;
        const fileObj = new File([arrayBuffer], baseName, { type: "" });

        if (size > maxImageSize) {
          oversize.push(baseName);
        }

        entries.push({
          name: baseName,
          key: getMatchKey(baseName),
          size,
          file: fileObj,
        });
      }

      if (!entries.length) {
        setZipError("No valid image files found in ZIP.");
        setZipEntries([]);
        return;
      }

      setZipEntries(entries);
      setZipOversize(oversize);
    } catch {
      setZipError("Failed to read ZIP file.");
      setZipEntries([]);
    }
  };

  const mappedCounts = useMemo(() => {
    const available = new Set(zipEntries.map((entry) => entry.key));
    const needed = rows
      .flatMap((row) => [...row.category_image_urls, row.subcategory_image_url])
      .map((value) => getMatchKey(value))
      .filter(Boolean);
    const matched = needed.filter((key) => available.has(key));
    const missing = needed.filter((key) => !available.has(key));
    setMissingImages(Array.from(new Set(missing)));
    return { needed: needed.length, matched: matched.length };
  }, [rows, zipEntries, getMatchKey]);

  const summary = useMemo(() => {
    const brands = new Set(rows.map((row) => row.brand));
    const categories = new Set(rows.map((row) => row.category));
    const subcategories = new Set(rows.map((row) => row.subcategory));
    return {
      rows: rows.length,
      brands: brands.size,
      categories: categories.size,
      subcategories: subcategories.size,
    };
  }, [rows]);

  const handleUploadZipImages = async () => {
    setZipUploadMessage(null);
    setZipUploadFailures([]);
    setIsUploadingZip(true);
    const available = new Map(zipEntries.map((entry) => [entry.key, entry]));
    const neededKeys = Array.from(
      new Set(
        rows
          .flatMap((row) => [
            ...row.category_image_urls,
            row.subcategory_image_url,
          ])
          .map((value) => getMatchKey(value))
          .filter(Boolean),
      ),
    );
    const nextMap = new Map<string, string>();

    try {
      const failures: string[] = [];
      let successCount = 0;
      let skippedCount = 0;

      const existingResponse = await fetch("/api/uploads/list?folder=stock");
      if (existingResponse.ok) {
        const existingData = (await existingResponse
          .json()
          .catch(() => null)) as {
          files?: Array<{ name: string; publicUrl: string }>;
        } | null;
        const existingFiles = existingData?.files ?? [];
        for (const file of existingFiles) {
          const key = getMatchKey(file.name);
          if (key && !nextMap.has(key)) {
            nextMap.set(key, file.publicUrl);
          }
        }
      }

      for (const key of neededKeys) {
        if (!key || nextMap.has(key)) {
          if (key && nextMap.has(key)) skippedCount += 1;
          continue;
        }
        const entry = available.get(key);
        if (!entry || entry.size > maxImageSize) continue;

        const formData = new FormData();
        const safeName = getSafeFilename(entry.name);
        const uploadFile = new File([entry.file], safeName, {
          type: entry.file.type,
        });
        formData.append("file", uploadFile);
        const response = await fetch("/api/uploads?folder=stock&preserve=1", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = (await response.json().catch(() => null)) as {
            message?: string;
          } | null;
          failures.push(
            `${entry.name}: ${errorData?.message ?? "Upload failed."}`,
          );
          continue;
        }

        const data = (await response.json().catch(() => null)) as {
          publicUrl?: string;
        } | null;
        if (!data?.publicUrl) {
          failures.push(`${entry.name}: Missing public URL.`);
          continue;
        }

        nextMap.set(key, data.publicUrl);
        successCount += 1;
      }

      setUploadedImageMap(nextMap);
      setZipUploadFailures(failures);
      setZipUploadMessage(
        `Uploaded ${successCount} images. ${skippedCount} skipped. ${failures.length} failed.`,
      );
    } catch (err) {
      setZipUploadMessage(
        err instanceof Error ? err.message : "Upload failed.",
      );
    } finally {
      setIsUploadingZip(false);
    }
  };

  const applyUploadedImageUrls = () => {
    if (!uploadedImageMap.size) return;
    const nextRows = rows.map((row) => {
      const mappedCategoryImages = row.category_image_urls.map((value) => {
        const key = getMatchKey(value);
        const mapped = key ? uploadedImageMap.get(key) : null;
        return mapped ?? value;
      });
      const subKey = getMatchKey(row.subcategory_image_url);
      const subMapped = subKey ? uploadedImageMap.get(subKey) : null;
      const hasCategoryChange = mappedCategoryImages.some(
        (value, idx) => value !== row.category_image_urls[idx],
      );
      if (!hasCategoryChange && !subMapped) return row;
      return {
        ...row,
        category_image_urls: mappedCategoryImages,
        subcategory_image_url: subMapped ?? row.subcategory_image_url,
      };
    });
    setRows(nextRows);
    runValidation(nextRows);
  };

  const runValidation = (nextRows: StockRow[]) => {
    const issues: Array<{ row: number; field: string; message: string }> = [];
    nextRows.forEach((row, index) => {
      const rowNumber = index + 2;
      if (!row.brand)
        issues.push({
          row: rowNumber,
          field: "brand",
          message: "Brand is required.",
        });
      if (!row.category)
        issues.push({
          row: rowNumber,
          field: "category",
          message: "Category is required.",
        });
      if (!row.subcategory) {
        issues.push({
          row: rowNumber,
          field: "subcategory",
          message: "Sub-Category is required.",
        });
      }
      if (!row.order_no) {
        issues.push({
          row: rowNumber,
          field: "order_no",
          message: "Order# is required.",
        });
      }
      if (!row.code)
        issues.push({
          row: rowNumber,
          field: "code",
          message: "Code is required.",
        });
      if (!row.description) {
        issues.push({
          row: rowNumber,
          field: "description",
          message: "Description is required.",
        });
      }
      if (!row.category_image_urls.length) {
        issues.push({
          row: rowNumber,
          field: "category_image_urls",
          message: "Category Image is required.",
        });
      } else {
        row.category_image_urls.forEach((image) => {
          if (!allowedImageExt.test(image)) {
            issues.push({
              row: rowNumber,
              field: "category_image_urls",
              message:
                "Each Category Image must include a valid extension (.jpg, .jpeg, .png, .webp, .gif).",
            });
          }
        });
      }
      if (!row.subcategory_image_url) {
        issues.push({
          row: rowNumber,
          field: "subcategory_image_url",
          message: "Sub-Category Image is required.",
        });
      } else if (!allowedImageExt.test(row.subcategory_image_url)) {
        issues.push({
          row: rowNumber,
          field: "subcategory_image_url",
          message:
            "Sub-Category Image must include a valid extension (.jpg, .jpeg, .png, .webp, .gif).",
        });
      }
    });

    setValidationErrors(issues);
    setValidated(true);
  };

  const handleImport = async () => {
    if (importLocked) return;
    setImportMessage(null);
    setIsImporting(true);
    try {
      const response = await fetch("/api/admin/products/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ rows }),
      });

      const result = (await response.json().catch(() => ({}))) as {
        message?: string;
        imported?: number;
        skipped?: number;
      };

      if (!response.ok) {
        throw new Error(result.message || "Import failed.");
      }

      setImportMessage(
        result.message ||
          `Imported ${result.imported ?? 0} rows, skipped ${result.skipped ?? 0}.`,
      );
      setImportLocked(true);
      setRows([]);
      setSelectedFile(null);
      setValidated(false);
      setValidationErrors([]);
      setZipFile(null);
      setZipEntries([]);
      setZipOversize([]);
      setZipUploadMessage(null);
      setZipUploadFailures([]);
      setUploadedImageMap(new Map());
    } catch (err) {
      setImportMessage(err instanceof Error ? err.message : "Import failed.");
    } finally {
      setIsImporting(false);
    }
  };

  if (!checked) return null;

  return (
    <>
      <section>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Stock
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Import Stock
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Upload `Stock.xlsx` and import stock products with images and details.
        </p>
      </section>

      <PrimeCard className="mt-6 p-6">
        <div className="mb-6 rounded-2xl border border-border/60 bg-muted/10 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Image ZIP upload
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Upload stock images ZIP (max 3MB each).
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                `Category Image` supports multiple names like `images/A/B/C`.
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {zipFile ? `Selected: ${zipFile.name}` : "No ZIP selected."}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                ref={zipInputRef}
                type="file"
                accept=".zip"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  setZipFile(file);
                  if (file) void parseZip(file);
                  else {
                    setZipEntries([]);
                    setZipError(null);
                  }
                }}
              />
              <Button
                variant="outline"
                className="rounded-full"
                onClick={handlePickZip}
              >
                Upload ZIP
              </Button>
              <Button
                className="rounded-full"
                disabled={
                  isUploadingZip ||
                  isImporting ||
                  !zipEntries.length ||
                  zipOversize.length > 0
                }
                onClick={handleUploadZipImages}
              >
                {isUploadingZip ? "Uploading..." : "Upload Images"}
              </Button>
              <Button
                variant="outline"
                className="rounded-full"
                disabled={!uploadedImageMap.size || isImporting}
                onClick={applyUploadedImageUrls}
              >
                Apply URLs
              </Button>
            </div>
          </div>
          {zipError ? (
            <div className="mt-4 rounded-2xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {zipError}
            </div>
          ) : null}
          {zipOversize.length ? (
            <div className="mt-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-600">
              {zipOversize.length} image files exceed 3MB.
            </div>
          ) : null}
          {zipUploadMessage ? (
            <div className="mt-4 rounded-2xl border border-border/60 bg-muted/10 px-4 py-3 text-sm text-foreground">
              {zipUploadMessage}
            </div>
          ) : null}
          {zipUploadFailures.length ? (
            <div className="mt-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-xs text-amber-700">
              {zipUploadFailures.slice(0, 5).map((item) => (
                <div key={item}>{item}</div>
              ))}
            </div>
          ) : null}
          {zipEntries.length ? (
            <div className="mt-4 text-xs text-muted-foreground">
              Matched {mappedCounts.matched} of {mappedCounts.needed} image
              names.
            </div>
          ) : null}
          {missingImages.length ? (
            <div className="mt-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-xs text-amber-700">
              Missing {missingImages.length} image names from ZIP.
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Excel upload
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Accepted format: `Stock.xlsx` (Sheet1)
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {selectedFile ? `Selected: ${selectedFile.name}` : "No file yet."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                setSelectedFile(file);
                if (file) void parseExcel(file);
                else {
                  setRows([]);
                  setError(null);
                }
              }}
            />
            <Button className="rounded-full" onClick={handlePickFile}>
              Upload Excel
            </Button>
            <Button
              variant="outline"
              className="rounded-full"
              disabled={!rows.length || isImporting}
              onClick={() => runValidation(rows)}
            >
              Validate
            </Button>
            <ConfirmationAlert
              title="Confirm import"
              description={`Import ${summary.rows} rows (${summary.brands} brands, ${summary.categories} categories, ${summary.subcategories} subcategories).`}
              confirmLabel={isImporting ? "Importing..." : "Import"}
              cancelLabel="Cancel"
              onConfirm={handleImport}
            >
              <Button
                className="rounded-full"
                disabled={
                  importLocked ||
                  isImporting ||
                  !rows.length ||
                  (validated && validationErrors.length > 0) ||
                  (zipEntries.length > 0 && uploadedImageMap.size === 0)
                }
              >
                {isImporting ? "Importing..." : "Import"}
              </Button>
            </ConfirmationAlert>
          </div>
        </div>

        <div className="mt-6">
          {rows.length ? (
            <div className="mb-4 rounded-2xl border border-border/60 bg-muted/10 px-4 py-3 text-sm text-foreground">
              Summary: {summary.rows} rows, {summary.brands} brands,{" "}
              {summary.categories} categories, {summary.subcategories}{" "}
              subcategories.
            </div>
          ) : null}
          {error ? (
            <div className="mb-4 rounded-2xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          ) : null}
          {validated && validationErrors.length ? (
            <div className="mb-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-600">
              Found {validationErrors.length} issues.
            </div>
          ) : null}
          {validated && !validationErrors.length ? (
            <div className="mb-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-600">
              Validation passed. No issues found.
            </div>
          ) : null}
          {importMessage ? (
            <div className="mb-4 rounded-2xl border border-border/60 bg-muted/10 px-4 py-3 text-sm text-foreground">
              {importMessage}
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
              {rows.length ? (
                rows.slice(0, 100).map((row, index) => (
                  <TableRow key={`${row.brand}-${row.order_no}-${index}`}>
                    <TableCell>{row.brand || "-"}</TableCell>
                    <TableCell>{row.category || "-"}</TableCell>
                    <TableCell>{row.subcategory || "-"}</TableCell>
                    <TableCell>{row.order_no || "-"}</TableCell>
                    <TableCell>{row.code || "-"}</TableCell>
                    <TableCell className="max-w-80 truncate">
                      {row.description || "-"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-sm">
                    Upload a file to preview rows here.
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
