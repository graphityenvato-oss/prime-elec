import { NextResponse } from "next/server";
import { z } from "zod";

import { supabaseAdmin } from "@/lib/supabase/admin";

const stockSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("home_featured_stock")
    .select("*")
    .order("id", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { message: "Failed to load featured stock content." },
      { status: 500 },
    );
  }

  if (!data) {
    return NextResponse.json({
      eyebrow: "",
      title: "",
      description: "",
    });
  }

  return NextResponse.json({
    eyebrow: data.eyebrow,
    title: data.title,
    description: data.description,
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = stockSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid featured stock payload." },
      { status: 400 },
    );
  }

  const { error } = await supabaseAdmin.from("home_featured_stock").upsert(
    {
      id: 1,
      eyebrow: parsed.data.eyebrow,
      title: parsed.data.title,
      description: parsed.data.description,
    },
    { onConflict: "id" },
  );

  if (error) {
    return NextResponse.json(
      { message: "Failed to save featured stock content." },
      { status: 500 },
    );
  }

  return NextResponse.json({ status: "ok" });
}
