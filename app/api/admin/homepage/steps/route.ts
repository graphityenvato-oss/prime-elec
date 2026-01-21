import { NextResponse } from "next/server";
import { z } from "zod";

import { supabaseAdmin } from "@/lib/supabase/admin";

const stepSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  imageUrl: z.string(),
  imagePath: z.string(),
});

const stepsSchema = z.object({
  title: z.string().min(1),
  steps: z.array(stepSchema).length(3),
});

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("home_steps")
    .select("*")
    .order("id", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { message: "Failed to load steps." },
      { status: 500 },
    );
  }

  if (!data) {
    return NextResponse.json({
      title: "",
      steps: [
        { title: "", description: "", imageUrl: "", imagePath: "" },
        { title: "", description: "", imageUrl: "", imagePath: "" },
        { title: "", description: "", imageUrl: "", imagePath: "" },
      ],
    });
  }

  return NextResponse.json({
    title: data.title,
    steps: [
      {
        title: data.step1_title,
        description: data.step1_description,
        imageUrl: data.step1_image_url ?? "",
        imagePath: data.step1_image_path ?? "",
      },
      {
        title: data.step2_title,
        description: data.step2_description,
        imageUrl: data.step2_image_url ?? "",
        imagePath: data.step2_image_path ?? "",
      },
      {
        title: data.step3_title,
        description: data.step3_description,
        imageUrl: data.step3_image_url ?? "",
        imagePath: data.step3_image_path ?? "",
      },
    ],
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = stepsSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid steps payload." },
      { status: 400 },
    );
  }

  const payload = {
    id: 1,
    title: parsed.data.title,
    step1_title: parsed.data.steps[0].title,
    step1_description: parsed.data.steps[0].description,
    step1_image_url: parsed.data.steps[0].imageUrl,
    step1_image_path: parsed.data.steps[0].imagePath,
    step2_title: parsed.data.steps[1].title,
    step2_description: parsed.data.steps[1].description,
    step2_image_url: parsed.data.steps[1].imageUrl,
    step2_image_path: parsed.data.steps[1].imagePath,
    step3_title: parsed.data.steps[2].title,
    step3_description: parsed.data.steps[2].description,
    step3_image_url: parsed.data.steps[2].imageUrl,
    step3_image_path: parsed.data.steps[2].imagePath,
  };

  const { error } = await supabaseAdmin
    .from("home_steps")
    .upsert(payload, { onConflict: "id" });

  if (error) {
    return NextResponse.json(
      { message: "Failed to save steps." },
      { status: 500 },
    );
  }

  return NextResponse.json({ status: "ok" });
}
