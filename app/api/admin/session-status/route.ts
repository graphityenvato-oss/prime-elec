import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) {
    return NextResponse.json({ isAdmin: false });
  }

  const { data: userData, error: userError } =
    await supabaseAdmin.auth.getUser(token);

  if (userError || !userData.user) {
    return NextResponse.json({ isAdmin: false });
  }

  const { data, error } = await supabaseAdmin
    .from("admin_users")
    .select("id")
    .eq("user_id", userData.user.id)
    .limit(1);

  if (error) {
    return NextResponse.json({ isAdmin: false }, { status: 500 });
  }

  return NextResponse.json({ isAdmin: (data?.length ?? 0) > 0 });
}
