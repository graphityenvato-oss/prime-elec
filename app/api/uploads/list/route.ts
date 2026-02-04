import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const folder = url.searchParams.get("folder") || "uploads";
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "uploads";

  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .list(folder, { limit: 1000 });

  if (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 },
    );
  }

  const files = (data ?? [])
    .filter((item) => item.name)
    .map((item) => {
      const path = `${folder}/${item.name}`;
      const { data: publicData } = supabaseAdmin.storage
        .from(bucket)
        .getPublicUrl(path);
      return {
        name: item.name,
        publicUrl: publicData.publicUrl,
      };
    });

  return NextResponse.json({ files });
}
