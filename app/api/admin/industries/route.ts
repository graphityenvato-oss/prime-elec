import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
  if (userError || !userData.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { data: admins, error: adminError } = await supabaseAdmin
    .from("admin_users")
    .select("id")
    .eq("user_id", userData.user.id)
    .limit(1);
  if (adminError || !admins?.length) {
    return NextResponse.json(
      { message: adminError ? "Failed to verify admin access." : "Unauthorized" },
      { status: adminError ? 500 : 403 },
    );
  }

  const form = await request.formData().catch(() => null);
  const rawName = form?.get("name");
  const rawDescription = form?.get("description");
  let name = typeof rawName === "string" ? rawName.trim() : "";
  const description = typeof rawDescription === "string" ? rawDescription.trim() : "";
  const image = form?.get("image");
  if (/^data centres?$/i.test(name)) name = "Data Centers";
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  if (!name || !description || !(image instanceof File) || !image.size) {
    return NextResponse.json({ message: "Industry name, description, and image are required." }, { status: 400 });
  }
  if (!slug) {
    return NextResponse.json({ message: "Industry name must contain letters or numbers." }, { status: 400 });
  }
  const extension = image.name.toLowerCase().match(/\.(jpg|jpeg|png|webp|gif)$/)?.[1];
  const mimeTypes: Record<string, string> = {
    jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif",
  };
  if (!extension || image.type !== mimeTypes[extension]) {
    return NextResponse.json({ message: "Choose a JPG, PNG, WEBP, or GIF image." }, { status: 400 });
  }
  if (image.size > 3 * 1024 * 1024) {
    return NextResponse.json({ message: "Image must be 3 MB or smaller." }, { status: 400 });
  }

  const { data: existing, error: lookupError } = await supabaseAdmin
    .from("industries").select("id").eq("slug", slug).limit(1);
  if (lookupError) {
    return NextResponse.json({ message: "Failed to check existing industries." }, { status: 500 });
  }
  if (existing?.length) {
    return NextResponse.json({ message: "An industry with this name already exists." }, { status: 409 });
  }

  const bucket = supabaseAdmin.storage.from(process.env.SUPABASE_STORAGE_BUCKET || "uploads");
  const path = `industries/${slug}-${randomUUID()}.${extension}`;
  const { error: uploadError } = await bucket.upload(path, new Uint8Array(await image.arrayBuffer()), {
    contentType: mimeTypes[extension], upsert: false,
  });
  if (uploadError) {
    return NextResponse.json({ message: "Failed to upload industry image." }, { status: 500 });
  }
  const { data: publicUrlData } = bucket.getPublicUrl(path);
  const { data, error } = await supabaseAdmin.from("industries")
    .insert({ name, slug, description, image_url: publicUrlData.publicUrl })
    .select("id, name, slug, description, image_url").single();
  if (error || !data) {
    await bucket.remove([path]);
    return NextResponse.json(
      { message: error?.code === "23505" ? "An industry with this name already exists." : "Failed to create industry." },
      { status: error?.code === "23505" ? 409 : 500 },
    );
  }
  return NextResponse.json({ industry: data }, { status: 201 });
}
