import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "File is required." }, { status: 400 });
  }

  const url = new URL(request.url);
  const folder = url.searchParams.get("folder") || "uploads";
  const preserveName = url.searchParams.get("preserve") === "1";
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "uploads";

  const arrayBuffer = await file.arrayBuffer();
  const filePath = preserveName
    ? `${folder}/${file.name}`
    : `${folder}/${Date.now()}-${file.name}`;
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(filePath, new Uint8Array(arrayBuffer), {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  const { data: publicUrlData } = supabaseAdmin.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return NextResponse.json(
    { path: data.path, publicUrl: publicUrlData.publicUrl },
    { status: 201 },
  );
}
