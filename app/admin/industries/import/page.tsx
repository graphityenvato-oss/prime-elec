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

type IndustryRow = {
  industry: string;
  description: string;
  image_url: string;
};

export default function AdminIndustriesImportPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [checked, setChecked] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [rows, setRows] = useState<IndustryRow[]>([]);
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

    loadSession();

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

    const data = XLSX.utils.sheet_to_json<Array<string | number | boolean>>(
      sheet,
      { header: 1, defval: "" },
    );

    if (!data.length) {
      setRows([]);
      setError("No rows found in sheet.");
      return;
    }

    const headerRow = data[0].map((value) =>
      String(value).trim().toLowerCase(),
    );
    const indexOf = (key: string) => headerRow.indexOf(key);
    const indexOfAny = (keys: string[]) =>
      keys.map(indexOf).find((value) => value !== -1) ?? -1;

    const required = ["industry", "description", "image"];
    const missing = required.filter((key) => {
      if (key === "description") {
        return indexOfAny(["description", "discription"]) === -1;
      }
      if (key === "image") {
        return indexOfAny(["image", "image_url"]) === -1;
      }
      return indexOf(key) === -1;
    });
    if (missing.length) {
      setRows([]);
      setError(`Missing columns: ${missing.join(", ")}`);
      return;
    }

    const industryIndex = indexOfAny(["industry", "industries"]);
    const descriptionIndex = indexOfAny(["description", "discription"]);
    const imageIndex = indexOfAny(["image", "image_url"]);

    const parsed = data
      .slice(1)
      .map((row) => ({
        industry: String(row[industryIndex] ?? "").trim(),
        description: String(row[descriptionIndex] ?? "").trim(),
        image_url: String(row[imageIndex] ?? "").trim(),
      }))
      .filter((row) => row.industry || row.description || row.image_url);

    setRows(parsed);
    runValidation(parsed);
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
        const name = entry.name;
        const baseName = normalizeFilename(name);
        if (!allowedImageExt.test(baseName.toLowerCase())) {
          continue;
        }

        const arrayBuffer = await entry.async("arraybuffer");
        const size = arrayBuffer.byteLength;
        const fileObj = new File([arrayBuffer], baseName, {
          type: "",
        });

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
      .map((row) => getMatchKey(row.image_url))
      .filter(Boolean);
    const matched = needed.filter((key) => available.has(key));
    const missing = needed.filter((key) => !available.has(key));
    setMissingImages(Array.from(new Set(missing)));
    return {
      needed: needed.length,
      matched: matched.length,
    };
  }, [rows, zipEntries, getMatchKey]);

  const summary = useMemo(() => {
    const industries = new Set(rows.map((row) => row.industry));
    return {
      rows: rows.length,
      industries: industries.size,
    };
  }, [rows]);

  const handleUploadZipImages = async () => {
    setZipUploadMessage(null);
    setZipUploadFailures([]);
    setIsUploadingZip(true);
    const available = new Map(zipEntries.map((entry) => [entry.key, entry]));
    const neededKeys = Array.from(
      new Set(rows.map((row) => getMatchKey(row.image_url)).filter(Boolean)),
    );

    const nextMap = new Map<string, string>();

    try {
      const failures: string[] = [];
      let successCount = 0;
      let skippedCount = 0;
      const existingResponse = await fetch(
        "/api/uploads/list?folder=industries",
      );
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
        if (!entry) continue;
        if (entry.size > maxImageSize) continue;

        const formData = new FormData();
        const safeName = getSafeFilename(entry.name);
        const uploadFile = new File([entry.file], safeName, {
          type: entry.file.type,
        });
        formData.append("file", uploadFile);
        const response = await fetch(
          "/api/uploads?folder=industries&preserve=1",
          {
            method: "POST",
            body: formData,
          },
        );

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
        err instanceof Error ? err.message : "Image upload failed.",
      );
    } finally {
      setIsUploadingZip(false);
    }
  };

  const applyUploadedImageUrls = () => {
    if (!uploadedImageMap.size) return;
    const nextRows = rows.map((row) => {
      const key = getMatchKey(row.image_url);
      const mapped = key ? uploadedImageMap.get(key) : null;
      if (!mapped) return row;
      return { ...row, image_url: mapped };
    });
    setRows(nextRows);
    runValidation(nextRows);
  };

  const downloadMissingCsv = () => {
    if (!missingImages.length) return;
    const header = "missing_image_key";
    const rows = missingImages.map((name) => `"${name.replace(/\"/g, '""')}"`);
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "missing-images.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const runValidation = (nextRows: IndustryRow[]) => {
    const issues: Array<{ row: number; field: string; message: string }> = [];
    nextRows.forEach((row, index) => {
      const rowNumber = index + 2;
      if (!row.industry) {
        issues.push({
          row: rowNumber,
          field: "industry",
          message: "Industry is required.",
        });
      }
      if (!row.description) {
        issues.push({
          row: rowNumber,
          field: "description",
          message: "Description is required.",
        });
      }
      if (!row.image_url) {
        issues.push({
          row: rowNumber,
          field: "image_url",
          message: "Image URL is required.",
        });
      } else if (!/\.(jpg|jpeg|png|webp|gif)$/i.test(row.image_url)) {
        issues.push({
          row: rowNumber,
          field: "image_url",
          message:
            "Image URL must include a valid extension (.jpg, .jpeg, .png, .webp, .gif).",
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
      const response = await fetch("/api/admin/industries/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          rows: rows.map((row) => ({
            industry: row.industry,
            description: row.description,
            image_url: row.image_url,
          })),
        }),
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
      const message = err instanceof Error ? err.message : "Import failed.";
      setImportMessage(message);
    } finally {
      setIsImporting(false);
    }
  };

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
          Import Industries
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Upload the Excel file to preview and import industries.
        </p>
      </section>

      <div className="mt-6 rounded-2xl border border-border/60 bg-muted/10 p-5">
        <p className="text-sm font-semibold text-foreground">
          Import flow guide
        </p>
        <div className="mt-2 space-y-1 text-xs text-muted-foreground">
          <div>1. Upload Excel first so image names are known.</div>
          <div>2. Upload a ZIP that contains images.</div>
          <div>
            3. Filenames should match Excel image names after
            <code className="mx-1 rounded bg-muted px-1">images/</code>
            and may include suffix{" "}
            <code className="mx-1 rounded bg-muted px-1">_min</code>.
          </div>
          <div>4. Images must be 68px x 68px and under 10KB.</div>
          <div>5. Click Upload Images, then Apply URLs.</div>
          <div>6. Validate and Import.</div>
        </div>
      </div>

      <PrimeCard className="mt-6 p-6">
        <div className="mb-6 rounded-2xl border border-border/60 bg-muted/10 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Image ZIP upload
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Upload a ZIP with images (max 10KB each).
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
                  if (file) {
                    void parseZip(file);
                  } else {
                    setZipEntries([]);
                    setZipError(null);
                  }
                }}
              />
              <Button
                variant="outline"
                className="rounded-full"
                onClick={handlePickZip}
                disabled={isUploadingZip || isImporting}
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
              {zipOversize.length} image
              {zipOversize.length === 1 ? " is" : "s are"} over 10KB. Remove
              them from the ZIP.
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
              {zipUploadFailures.length > 5 ? (
                <div>Showing first 5 of {zipUploadFailures.length}.</div>
              ) : null}
            </div>
          ) : null}
          {zipEntries.length ? (
            <div className="mt-4 text-xs text-muted-foreground">
              Matched {mappedCounts.matched} of {mappedCounts.needed} image
              names from Excel.
            </div>
          ) : null}
          {missingImages.length ? (
            <div className="mt-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-xs text-amber-700">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span>
                  Missing {missingImages.length} image
                  {missingImages.length === 1 ? "" : "s"} from ZIP. First 10:
                </span>
                <Button
                  variant="outline"
                  className="h-8 rounded-full px-3 text-xs"
                  onClick={downloadMissingCsv}
                >
                  Download CSV
                </Button>
              </div>
              <div className="mt-2 space-y-1">
                {missingImages.slice(0, 10).map((name) => (
                  <div key={name}>{name}</div>
                ))}
              </div>
              {missingImages.length > 10 ? (
                <div className="mt-2">
                  Showing first 10 of {missingImages.length}.
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Excel upload
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Accepted format: .xlsx
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
                if (file) {
                  void parseExcel(file);
                } else {
                  setRows([]);
                  setError(null);
                }
              }}
            />
            <Button
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handlePickFile}
              disabled={isImporting}
            >
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
              description={`This will import ${summary.rows} rows (${summary.industries} industries) and update existing rows.`}
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
              Summary: {summary.rows} rows, {summary.industries} industries.
            </div>
          ) : null}
          {error ? (
            <div className="mb-4 rounded-2xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          ) : null}
          {validated && !validationErrors.length ? (
            <div className="mb-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-600">
              Validation passed. No issues found.
            </div>
          ) : null}
          {validated && validationErrors.length ? (
            <div className="mb-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-600">
              Found {validationErrors.length} issue
              {validationErrors.length === 1 ? "" : "s"}.
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
                <TableHead>Industry</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Image URL</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length ? (
                rows.map((row, index) => (
                  <TableRow key={`${row.industry}-${index}`}>
                    <TableCell className="font-medium">
                      {row.industry || "-"}
                    </TableCell>
                    <TableCell className="max-w-96 truncate">
                      {row.description || "-"}
                    </TableCell>
                    <TableCell className="max-w-50 truncate">
                      {row.image_url || "-"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-sm">
                    Upload a file to preview rows here.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {validated && validationErrors.length ? (
            <div className="mt-6 rounded-2xl border border-border/60 bg-muted/10 p-4">
              <p className="text-sm font-semibold text-foreground">
                Validation issues
              </p>
              <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                {validationErrors.slice(0, 10).map((issue, index) => (
                  <div key={`${issue.row}-${issue.field}-${index}`}>
                    Row {issue.row}: {issue.field} - {issue.message}
                  </div>
                ))}
                {validationErrors.length > 10 ? (
                  <div>
                    Showing first 10 of {validationErrors.length} issues.
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </PrimeCard>
    </>
  );
}
