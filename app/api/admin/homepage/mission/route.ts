import { NextResponse } from "next/server";
import { z } from "zod";

import { supabaseAdmin } from "@/lib/supabase/admin";

const cardSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

const missionSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  imageUrl: z.string().optional().default(""),
  imagePath: z.string().optional().default(""),
  cards: z.array(cardSchema).length(4),
});

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("home_mission")
    .select("*")
    .order("id", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { message: "Failed to load mission content." },
      { status: 500 },
    );
  }

  if (!data) {
    return NextResponse.json({
      title: "",
      description: "",
      imageUrl: "",
      imagePath: "",
      cards: [
        { title: "", description: "" },
        { title: "", description: "" },
        { title: "", description: "" },
        { title: "", description: "" },
      ],
    });
  }

  return NextResponse.json({
    title: data.title,
    description: data.description,
    imageUrl: data.image_url ?? "",
    imagePath: data.image_path ?? "",
    cards: [
      { title: data.card1_title, description: data.card1_description },
      { title: data.card2_title, description: data.card2_description },
      { title: data.card3_title, description: data.card3_description },
      { title: data.card4_title, description: data.card4_description },
    ],
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = missionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid mission payload." },
      { status: 400 },
    );
  }

  const payload = {
    id: 1,
    title: parsed.data.title,
    description: parsed.data.description,
    image_url: parsed.data.imageUrl ?? "",
    image_path: parsed.data.imagePath ?? "",
    card1_title: parsed.data.cards[0].title,
    card1_description: parsed.data.cards[0].description,
    card2_title: parsed.data.cards[1].title,
    card2_description: parsed.data.cards[1].description,
    card3_title: parsed.data.cards[2].title,
    card3_description: parsed.data.cards[2].description,
    card4_title: parsed.data.cards[3].title,
    card4_description: parsed.data.cards[3].description,
  };

  const { error } = await supabaseAdmin
    .from("home_mission")
    .upsert(payload, { onConflict: "id" });

  if (error) {
    return NextResponse.json(
      { message: "Failed to save mission content." },
      { status: 500 },
    );
  }

  return NextResponse.json({ status: "ok" });
}
