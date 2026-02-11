import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

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

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ message: "Missing id." }, { status: 400 });
  }

  const body = (await request.json().catch(() => null)) as {
    name?: string;
    description?: string;
    image_url?: string;
  } | null;

  const name = String(body?.name ?? "").trim();
  const description = String(body?.description ?? "").trim();
  const imageUrl = String(body?.image_url ?? "").trim();

  if (!name || !description || !imageUrl) {
    return NextResponse.json(
      { message: "Name, description, and image URL are required." },
      { status: 400 },
    );
  }

  if (!/\.(jpg|jpeg|png|webp|gif)$/i.test(imageUrl)) {
    return NextResponse.json(
      { message: "Image URL must include a valid extension." },
      { status: 400 },
    );
  }

  const { data, error } = await supabaseAdmin
    .from("industries")
    .update({
      name,
      slug: slugify(name),
      description,
      image_url: imageUrl,
    })
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json(
      { message: "Failed to update industry.", details: error?.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ industry: data });
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

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ message: "Missing id." }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("industries")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { message: "Failed to delete industry.", details: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ status: "ok" });
}
