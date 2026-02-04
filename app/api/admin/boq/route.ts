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

export async function GET(request: Request) {
  const admin = await getAdminUser(request);
  if (!admin.ok) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: admin.status },
    );
  }

  const { data, error } = await supabaseAdmin
    .from("boq_requests")
    .select(
      "id, full_name, phone, project_name, notes, file_url, file_path, read_at, created_at",
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("BOQ list error:", error);
    return NextResponse.json(
      { message: "Failed to load BOQ requests." },
      { status: 500 },
    );
  }

  return NextResponse.json({ requests: data ?? [] });
}
