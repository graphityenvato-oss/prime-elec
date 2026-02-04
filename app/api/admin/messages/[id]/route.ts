import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";

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

  const body = (await request.json().catch(() => null)) as
    | { read?: boolean }
    | null;
  const shouldMarkRead = body?.read !== false;
  const updatePayload = {
    read_at: shouldMarkRead ? new Date().toISOString() : null,
  };

  const { error } = await supabaseAdmin
    .from("contact_messages")
    .update(updatePayload)
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { message: "Failed to update message." },
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

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ message: "Missing id." }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("contact_messages")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { message: "Failed to delete message." },
      { status: 500 },
    );
  }

  return NextResponse.json({ status: "ok" });
}
