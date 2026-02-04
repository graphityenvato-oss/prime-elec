import { NextResponse } from "next/server";
import { z } from "zod";

import { supabaseAdmin } from "@/lib/supabase/admin";

const payloadSchema = z.object({
  fullName: z.string().min(1),
  phone: z.string().min(1),
  projectName: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  const payload = payloadSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    projectName: formData.get("projectName"),
    notes: formData.get("notes"),
  });

  if (!payload.success) {
    return NextResponse.json(
      { message: "Name and phone are required." },
      { status: 400 },
    );
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "File is required." }, { status: 400 });
  }

  const maxSize = 2 * 1024 * 1024;
  if (file.size > maxSize) {
    return NextResponse.json(
      { message: "File must be under 2MB." },
      { status: 400 },
    );
  }

  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "uploads";
  const folder = "boq";
  const arrayBuffer = await file.arrayBuffer();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = `${folder}/${Date.now()}-${safeName}`;

  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(filePath, new Uint8Array(arrayBuffer), {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (error) {
    return NextResponse.json(
      { message: "File upload failed." },
      { status: 500 },
    );
  }

  const { data: publicUrlData } = supabaseAdmin.storage
    .from(bucket)
    .getPublicUrl(data.path);

  const { error: insertError } = await supabaseAdmin
    .from("boq_requests")
    .insert({
      full_name: payload.data.fullName,
      phone: payload.data.phone,
      project_name: payload.data.projectName ?? null,
      notes: payload.data.notes ?? null,
      file_path: data.path,
      file_url: publicUrlData.publicUrl,
    });

  if (insertError) {
    return NextResponse.json(
      { message: "Failed to save request." },
      { status: 500 },
    );
  }

  return NextResponse.json({ status: "ok" }, { status: 201 });
}
