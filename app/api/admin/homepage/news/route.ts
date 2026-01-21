import { NextResponse } from "next/server";
import { z } from "zod";

import { supabaseAdmin } from "@/lib/supabase/admin";

const newsSchema = z.object({
  title: z.string().min(1),
  buttonLabel: z.string().min(1),
  buttonHref: z.string().min(1),
});

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("home_news")
    .select("*")
    .order("id", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { message: "Failed to load news content." },
      { status: 500 },
    );
  }

  if (!data) {
    return NextResponse.json({
      title: "",
      buttonLabel: "",
      buttonHref: "",
    });
  }

  return NextResponse.json({
    title: data.title,
    buttonLabel: data.button_label,
    buttonHref: data.button_href,
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = newsSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid news payload." },
      { status: 400 },
    );
  }

  const payload = {
    id: 1,
    title: parsed.data.title,
    button_label: parsed.data.buttonLabel,
    button_href: parsed.data.buttonHref,
  };

  const { error } = await supabaseAdmin
    .from("home_news")
    .upsert(payload, { onConflict: "id" });

  if (error) {
    return NextResponse.json(
      { message: "Failed to save news content." },
      { status: 500 },
    );
  }

  return NextResponse.json({ status: "ok" });
}
