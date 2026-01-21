import { NextResponse } from "next/server";
import { z } from "zod";

import { supabaseAdmin } from "@/lib/supabase/admin";

const testimonialSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  quote: z.string().min(1),
  rating: z.number().int().min(1).max(5),
});

const payloadSchema = z.object({
  title: z.string().min(1),
  items: z.array(testimonialSchema).max(10),
});

export async function GET() {
  const { data: section, error: sectionError } = await supabaseAdmin
    .from("home_testimonials_section")
    .select("*")
    .order("id", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (sectionError) {
    return NextResponse.json(
      { message: "Failed to load testimonials." },
      { status: 500 },
    );
  }

  const { data: items, error: itemsError } = await supabaseAdmin
    .from("home_testimonials")
    .select("*")
    .order("position", { ascending: true });

  if (itemsError) {
    return NextResponse.json(
      { message: "Failed to load testimonials." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    title: section?.title ?? "",
    items:
      items?.map((item) => ({
        name: item.name,
        role: item.role,
        quote: item.quote,
        rating: item.rating ?? 5,
      })) ?? [],
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = payloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid testimonials payload." },
      { status: 400 },
    );
  }

  const { error: sectionError } = await supabaseAdmin
    .from("home_testimonials_section")
    .upsert({ id: 1, title: parsed.data.title }, { onConflict: "id" });

  if (sectionError) {
    return NextResponse.json(
      { message: "Failed to save testimonials title." },
      { status: 500 },
    );
  }

  const { error: deleteError } = await supabaseAdmin
    .from("home_testimonials")
    .delete()
    .gt("position", 0);

  if (deleteError) {
    return NextResponse.json(
      { message: "Failed to save testimonials." },
      { status: 500 },
    );
  }

  if (parsed.data.items.length > 0) {
    const payload = parsed.data.items.map((item, index) => ({
      position: index + 1,
      name: item.name,
      role: item.role,
      quote: item.quote,
      rating: item.rating,
    }));

    const { error: insertError } = await supabaseAdmin
      .from("home_testimonials")
      .insert(payload);

    if (insertError) {
      return NextResponse.json(
        { message: "Failed to save testimonials." },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ status: "ok" });
}
