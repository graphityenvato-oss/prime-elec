import { NextResponse } from "next/server";
import { z } from "zod";

import { supabaseAdmin } from "@/lib/supabase/admin";

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
  featuredImageUrl: z.string().url().optional(),
  featuredImagePath: z.string().min(1).optional(),
  galleryImages: z
    .array(
      z.object({
        url: z.string().url(),
        path: z.string().min(1),
      }),
    )
    .max(3)
    .optional(),
  author: z.string().min(1).optional(),
  readTimeMinutes: z.number().int().min(1).optional(),
  status: z.enum(["draft", "published", "scheduled"]).optional(),
  scheduledAt: z.string().datetime().optional().nullable(),
  bodyJson: z.any().optional(),
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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getAdminUser(request);
  if (!admin.ok) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: admin.status },
    );
  }

  const resolvedParams = await params;
  const { data, error } = await supabaseAdmin
    .from("blogs")
    .select(
      "id, title, slug, category, tags, featured_image_url, featured_image_path, gallery_images, author, read_time_minutes, status, scheduled_at, body_json",
    )
    .eq("id", resolvedParams.id)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json(
      { message: "Failed to load blog." },
      { status: 500 },
    );
  }

  return NextResponse.json({ blog: data });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getAdminUser(request);
  if (!admin.ok) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: admin.status },
    );
  }

  const resolvedParams = await params;
  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid blog payload." },
      { status: 400 },
    );
  }

  const payload = parsed.data;
  const updatePayload: Record<string, unknown> = {};

  if (payload.title !== undefined) updatePayload.title = payload.title;
  if (payload.slug !== undefined) updatePayload.slug = payload.slug;
  if (payload.category !== undefined) updatePayload.category = payload.category;
  if (payload.tags !== undefined) updatePayload.tags = payload.tags;
  if (payload.featuredImageUrl !== undefined)
    updatePayload.featured_image_url = payload.featuredImageUrl;
  if (payload.featuredImagePath !== undefined)
    updatePayload.featured_image_path = payload.featuredImagePath;
  if (payload.galleryImages !== undefined)
    updatePayload.gallery_images = payload.galleryImages;
  if (payload.author !== undefined) updatePayload.author = payload.author;
  if (payload.readTimeMinutes !== undefined)
    updatePayload.read_time_minutes = payload.readTimeMinutes;
  if (payload.status !== undefined) updatePayload.status = payload.status;
  if (payload.scheduledAt !== undefined)
    updatePayload.scheduled_at = payload.scheduledAt;
  if (payload.bodyJson !== undefined)
    updatePayload.body_json = payload.bodyJson;

  const { error } = await supabaseAdmin
    .from("blogs")
    .update(updatePayload)
    .eq("id", resolvedParams.id);

  if (error) {
    return NextResponse.json(
      { message: "Failed to update blog." },
      { status: 500 },
    );
  }

  return NextResponse.json({ status: "ok" });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getAdminUser(request);
  if (!admin.ok) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: admin.status },
    );
  }

  const resolvedParams = await params;
  const { data, error } = await supabaseAdmin
    .from("blogs")
    .select("featured_image_path, gallery_images")
    .eq("id", resolvedParams.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { message: "Failed to load blog." },
      { status: 500 },
    );
  }

  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "uploads";
  const paths: string[] = [];

  if (data?.featured_image_path) {
    paths.push(data.featured_image_path);
  }

  if (Array.isArray(data?.gallery_images)) {
    data.gallery_images.forEach((item: { path?: string }) => {
      if (item?.path) {
        paths.push(item.path);
      }
    });
  }

  if (paths.length) {
    await supabaseAdmin.storage.from(bucket).remove(paths);
  }

  const { error: deleteError } = await supabaseAdmin
    .from("blogs")
    .delete()
    .eq("id", resolvedParams.id);

  if (deleteError) {
    return NextResponse.json(
      { message: "Failed to delete blog." },
      { status: 500 },
    );
  }

  return NextResponse.json({ status: "ok" });
}
