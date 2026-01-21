import { NextResponse } from "next/server";
import { z } from "zod";

import { supabaseAdmin } from "@/lib/supabase/admin";

const trustedSchema = z.object({
  title: z.string().min(1),
});

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("home_trusted_by")
    .select("*")
    .order("id", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { message: "Failed to load trusted by content." },
      { status: 500 },
    );
  }

  if (!data) {
    return NextResponse.json({ title: "" });
  }

  return NextResponse.json({ title: data.title });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = trustedSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid trusted by payload." },
      { status: 400 },
    );
  }

  const { error } = await supabaseAdmin
    .from("home_trusted_by")
    .upsert({ id: 1, title: parsed.data.title }, { onConflict: "id" });

  if (error) {
    return NextResponse.json(
      { message: "Failed to save trusted by content." },
      { status: 500 },
    );
  }

  return NextResponse.json({ status: "ok" });
}
