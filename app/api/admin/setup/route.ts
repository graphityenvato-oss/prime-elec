import { NextResponse } from "next/server";
import { z } from "zod";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";

const setupSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(8),
});

const toEmail = (value: string) => {
  if (value.includes("@")) return value;
  return `${value}@primeelec.local`;
};

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rate = rateLimit({
    key: `admin-setup:${ip}`,
    limit: 5,
    windowMs: 60_000,
  });

  if (!rate.allowed) {
    return NextResponse.json(
      { message: "Too many attempts. Try again later." },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = setupSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid username or password." },
      { status: 400 },
    );
  }

  const { data: existingAdmins, error: existingError } = await supabaseAdmin
    .from("admin_users")
    .select("id")
    .limit(1);

  if (existingError) {
    return NextResponse.json(
      { message: "Failed to verify admin status." },
      { status: 500 },
    );
  }

  if ((existingAdmins?.length ?? 0) > 0) {
    return NextResponse.json(
      { message: "Admin already exists." },
      { status: 409 },
    );
  }

  const email = toEmail(parsed.data.username);
  const { data: userData, error: userError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password: parsed.data.password,
      email_confirm: true,
      user_metadata: {
        username: parsed.data.username,
      },
    });

  if (userError || !userData.user) {
    return NextResponse.json(
      { message: userError?.message || "Failed to create admin user." },
      { status: 500 },
    );
  }

  const { error: insertError } = await supabaseAdmin
    .from("admin_users")
    .insert({
      user_id: userData.user.id,
      username: parsed.data.username,
    });

  if (insertError) {
    return NextResponse.json({ message: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ status: "ok" }, { status: 201 });
}
