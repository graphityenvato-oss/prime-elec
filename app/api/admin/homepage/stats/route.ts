import { NextResponse } from "next/server";
import { z } from "zod";

import { supabaseAdmin } from "@/lib/supabase/admin";

const statSchema = z.object({
  title: z.string().min(1),
  value: z.number().nonnegative(),
  suffix: z.string().max(8).optional().default(""),
});

const payloadSchema = z.object({
  items: z.array(statSchema).min(1),
});

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("home_stats")
    .select("*")
    .order("position", { ascending: true });

  if (error) {
    return NextResponse.json(
      { message: "Failed to load stats." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    items:
      data?.map((item) => ({
        title: item.title,
        value: item.value,
        suffix: item.suffix ?? "",
      })) ?? [],
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = payloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid stats payload." },
      { status: 400 },
    );
  }

  const payload = parsed.data.items.map((item, index) => ({
    position: index + 1,
    title: item.title,
    value: item.value,
    suffix: item.suffix ?? "",
  }));

  const { error } = await supabaseAdmin
    .from("home_stats")
    .upsert(payload, { onConflict: "position" });

  if (error) {
    return NextResponse.json(
      { message: "Failed to save stats." },
      { status: 500 },
    );
  }

  return NextResponse.json({ status: "ok" });
}
