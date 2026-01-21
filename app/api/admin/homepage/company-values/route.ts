import { NextResponse } from "next/server";
import { z } from "zod";

import { supabaseAdmin } from "@/lib/supabase/admin";

const valuesSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  benefits: z.array(z.string().min(1)).length(5),
  buttonLabel: z.string().min(1),
  buttonHref: z.string().min(1),
  imageUrl: z.string(),
  imagePath: z.string(),
  highlightTitle: z.string().min(1),
  highlightDescription: z.string().min(1),
  highlightButtonLabel: z.string().min(1),
  highlightButtonHref: z.string().min(1),
});

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("home_company_values")
    .select("*")
    .order("id", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { message: "Failed to load company values." },
      { status: 500 },
    );
  }

  if (!data) {
    return NextResponse.json({
      eyebrow: "",
      title: "",
      description: "",
      benefits: ["", "", "", "", ""],
      buttonLabel: "",
      buttonHref: "",
      imageUrl: "",
      imagePath: "",
      highlightTitle: "",
      highlightDescription: "",
      highlightButtonLabel: "",
      highlightButtonHref: "",
    });
  }

  return NextResponse.json({
    eyebrow: data.eyebrow,
    title: data.title,
    description: data.description,
    benefits: [
      data.benefit1,
      data.benefit2,
      data.benefit3,
      data.benefit4,
      data.benefit5,
    ],
    buttonLabel: data.button_label,
    buttonHref: data.button_href,
    imageUrl: data.image_url,
    imagePath: data.image_path,
    highlightTitle: data.highlight_title,
    highlightDescription: data.highlight_description,
    highlightButtonLabel: data.highlight_button_label,
    highlightButtonHref: data.highlight_button_href,
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = valuesSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid company values payload." },
      { status: 400 },
    );
  }

  const payload = {
    id: 1,
    eyebrow: parsed.data.eyebrow,
    title: parsed.data.title,
    description: parsed.data.description,
    benefit1: parsed.data.benefits[0],
    benefit2: parsed.data.benefits[1],
    benefit3: parsed.data.benefits[2],
    benefit4: parsed.data.benefits[3],
    benefit5: parsed.data.benefits[4],
    button_label: parsed.data.buttonLabel,
    button_href: parsed.data.buttonHref,
    image_url: parsed.data.imageUrl,
    image_path: parsed.data.imagePath,
    highlight_title: parsed.data.highlightTitle,
    highlight_description: parsed.data.highlightDescription,
    highlight_button_label: parsed.data.highlightButtonLabel,
    highlight_button_href: parsed.data.highlightButtonHref,
  };

  const { error } = await supabaseAdmin
    .from("home_company_values")
    .upsert(payload, { onConflict: "id" });

  if (error) {
    return NextResponse.json(
      { message: "Failed to save company values." },
      { status: 500 },
    );
  }

  return NextResponse.json({ status: "ok" });
}
