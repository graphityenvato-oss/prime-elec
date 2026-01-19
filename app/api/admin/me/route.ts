import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

  if (!token) {
    return NextResponse.json({ isAdmin: false }, { status: 401 });
  }

  const { data: userData, error: userError } =
    await supabaseAdmin.auth.getUser(token);

  if (userError || !userData.user) {
    return NextResponse.json({ isAdmin: false }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("admin_users")
    .select("id")
    .eq("user_id", userData.user.id)
    .limit(1);

  if (error) {
    return NextResponse.json(
      { message: "Failed to verify admin user." },
      { status: 500 },
    );
  }

  return NextResponse.json({ isAdmin: (data?.length ?? 0) > 0 });
}
