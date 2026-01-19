import { NextResponse } from "next/server";
import { z } from "zod";

import { supabaseAdmin } from "@/lib/supabase/admin";

const heroSchema = z.object({
  mainTitle: z.string().min(1),
  subtitle: z.string().min(1),
  description: z.string().min(1),
  primaryButtonLabel: z.string().min(1),
  primaryButtonHref: z.string().min(1),
  secondaryButtonLabel: z.string().min(1),
  secondaryButtonHref: z.string().min(1),
});

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("home_hero")
    .select("*")
    .order("id", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { message: "Failed to load hero content." },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json({
      mainTitle: "",
      subtitle: "",
      description: "",
      primaryButtonLabel: "",
      primaryButtonHref: "",
      secondaryButtonLabel: "",
      secondaryButtonHref: "",
    });
  }

  return NextResponse.json({
    mainTitle: data.main_title,
    subtitle: data.subtitle,
    description: data.description,
    primaryButtonLabel: data.primary_button_label,
    primaryButtonHref: data.primary_button_href,
    secondaryButtonLabel: data.secondary_button_label,
    secondaryButtonHref: data.secondary_button_href,
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = heroSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid hero content payload." },
      { status: 400 }
    );
  }

  const payload = {
    id: 1,
    main_title: parsed.data.mainTitle,
    subtitle: parsed.data.subtitle,
    description: parsed.data.description,
    primary_button_label: parsed.data.primaryButtonLabel,
    primary_button_href: parsed.data.primaryButtonHref,
    secondary_button_label: parsed.data.secondaryButtonLabel,
    secondary_button_href: parsed.data.secondaryButtonHref,
  };

  const { error } = await supabaseAdmin
    .from("home_hero")
    .upsert(payload, { onConflict: "id" });

  if (error) {
    return NextResponse.json(
      { message: "Failed to save hero content." },
      { status: 500 }
    );
  }

  return NextResponse.json({ status: "ok" });
}
