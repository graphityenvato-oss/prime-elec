import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("admin_users")
    .select("id")
    .limit(1);

  if (error) {
    return NextResponse.json(
      { message: "Failed to check admin status." },
      { status: 500 },
    );
  }

  return NextResponse.json({ hasAdmin: (data?.length ?? 0) > 0 });
}
