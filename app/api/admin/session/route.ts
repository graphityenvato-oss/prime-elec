import { NextResponse } from "next/server";
import { z } from "zod";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";

const sessionSchema = z.object({
  accessToken: z.string().min(1),
});

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rate = rateLimit({
    key: `admin-session:${ip}`,
    limit: 10,
    windowMs: 60_000,
  });

  if (!rate.allowed) {
    return NextResponse.json(
      { message: "Too many attempts. Try again later." },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = sessionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid session payload." },
      { status: 400 },
    );
  }

  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(
    parsed.data.accessToken,
  );

  if (userError || !userData.user) {
    return NextResponse.json(
      { message: "Invalid access token." },
      { status: 401 },
    );
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

  if ((data?.length ?? 0) === 0) {
    return NextResponse.json(
      { message: "You do not have admin access." },
      { status: 403 },
    );
  }

  const response = NextResponse.json({ status: "ok" });
  response.cookies.set("admin_token", parsed.data.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
