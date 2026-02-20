import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";

type ImportRow = {
  industry: string;
  description: string;
  image_url: string;
};

type ValidationIssue = {
  row: number;
  field: string;
  message: string;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const normalizeIndustryName = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;

  const normalized = trimmed.toLowerCase();
  if (normalized === "data centres" || normalized === "data centre") {
    return "Data Centers";
  }

  return trimmed;
};

const getAdminUser = async (request: Request) => {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

  if (!token) {
    return { ok: false, status: 401 };
  }

  const { data: userData, error: userError } =
    await supabaseAdmin.auth.getUser(token);

  if (userError || !userData.user) {
    return { ok: false, status: 401 };
  }

  const { data, error } = await supabaseAdmin
    .from("admin_users")
    .select("id")
    .eq("user_id", userData.user.id)
    .limit(1);

  if (error) {
    return { ok: false, status: 500 };
  }

  return { ok: (data?.length ?? 0) > 0, status: 200 };
};

export async function POST(request: Request) {
  const admin = await getAdminUser(request);
  if (!admin.ok) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: admin.status },
    );
  }

  const body = (await request.json().catch(() => null)) as {
    rows?: ImportRow[];
  } | null;

  if (!body?.rows || !Array.isArray(body.rows)) {
    return NextResponse.json(
      { message: "Invalid payload. Expected rows array." },
      { status: 400 },
    );
  }

  const issues: ValidationIssue[] = [];
  const cleaned = body.rows
    .map((row, index) => {
      const rowNumber = index + 2;
      const industry = normalizeIndustryName(String(row.industry ?? ""));
      const description = String(row.description ?? "").trim();
      const imageUrl = String(row.image_url ?? "").trim();

      if (!industry) {
        issues.push({
          row: rowNumber,
          field: "industry",
          message: "Industry is required.",
        });
      }
      if (!description) {
        issues.push({
          row: rowNumber,
          field: "description",
          message: "Description is required.",
        });
      }
      if (!imageUrl) {
        issues.push({
          row: rowNumber,
          field: "image_url",
          message: "Image URL is required.",
        });
      } else if (!/\.(jpg|jpeg|png|webp|gif)$/i.test(imageUrl)) {
        issues.push({
          row: rowNumber,
          field: "image_url",
          message:
            "Image URL must include a valid extension (.jpg, .jpeg, .png, .webp, .gif).",
        });
      }

      return {
        rowNumber,
        industry,
        description,
        imageUrl,
      };
    })
    .filter((row) => row.industry || row.description || row.imageUrl);

  if (!cleaned.length) {
    return NextResponse.json(
      { message: "No rows to import." },
      { status: 400 },
    );
  }

  if (issues.length) {
    return NextResponse.json(
      {
        message: `Validation failed with ${issues.length} issue${
          issues.length === 1 ? "" : "s"
        }.`,
        issues: issues.slice(0, 50),
      },
      { status: 400 },
    );
  }

  const payload = cleaned.map((row) => ({
    name: row.industry,
    slug: slugify(row.industry),
    description: row.description,
    image_url: row.imageUrl,
  }));

  const { error } = await supabaseAdmin
    .from("industries")
    .upsert(payload, { onConflict: "name" });

  if (error) {
    return NextResponse.json(
      { message: "Failed to upsert industries.", details: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({
    message: `Imported ${payload.length} industries.`,
    imported: payload.length,
    skipped: 0,
  });
}
