import { NextResponse } from "next/server";
import { z } from "zod";

import { supabaseAdmin } from "@/lib/supabase/admin";

const blogCreateSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  category: z.string().min(1),
  tags: z.array(z.string()).default([]),
  featuredImageUrl: z.string().url(),
  featuredImagePath: z.string().min(1),
  galleryImages: z
    .array(
      z.object({
        url: z.string().url(),
        path: z.string().min(1),
      }),
    )
    .max(3)
    .default([]),
  author: z.string().min(1),
  readTimeMinutes: z.number().int().min(1),
  status: z.enum(["draft", "published", "scheduled"]),
  scheduledAt: z.string().datetime().optional().nullable(),
  bodyJson: z.any(),
});

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

export async function GET(request: Request) {
  const admin = await getAdminUser(request);
  if (!admin.ok) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: admin.status },
    );
  }

  const { data, error } = await supabaseAdmin
    .from("blogs")
    .select(
      "id, title, slug, category, status, author, read_time_minutes, published_at, created_at",
    )
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { message: "Failed to load blogs." },
      { status: 500 },
    );
  }

  return NextResponse.json({ blogs: data ?? [] });
}

export async function POST(request: Request) {
  const admin = await getAdminUser(request);
  if (!admin.ok) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: admin.status },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = blogCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid blog payload." },
      { status: 400 },
    );
  }

  const payload = parsed.data;
  const now = new Date().toISOString();

  const insertPayload = {
    title: payload.title,
    slug: payload.slug,
    category: payload.category,
    tags: payload.tags,
    featured_image_url: payload.featuredImageUrl,
    featured_image_path: payload.featuredImagePath,
    gallery_images: payload.galleryImages,
    author: payload.author,
    read_time_minutes: payload.readTimeMinutes,
    status: payload.status,
    body_json: payload.bodyJson,
    published_at: payload.status === "published" ? now : null,
    scheduled_at:
      payload.status === "scheduled" ? (payload.scheduledAt ?? null) : null,
  };

  const { error } = await supabaseAdmin.from("blogs").insert(insertPayload);

  if (error) {
    return NextResponse.json(
      { message: "Failed to save blog." },
      { status: 500 },
    );
  }

  return NextResponse.json({ status: "ok" }, { status: 201 });
}
