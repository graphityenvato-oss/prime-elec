import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";

const getAdminUser = async (request: Request) => {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

  if (!token) {
    return { ok: false, status: 401 };
  }

  const { data: userData, error: userError } =
    await supabaseAdmin.auth.getUser(token);

  if (userError || !userData.user) {
    return { ok: false, status: 401 };
  }

  const { data, error } = await supabaseAdmin
    .from("admin_users")
    .select("id")
    .eq("user_id", userData.user.id)
    .limit(1);

  if (error) {
    return { ok: false, status: 500 };
  }

  return { ok: (data?.length ?? 0) > 0, status: 200 };
};

const deleteIndustryImages = async () => {
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "uploads";
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .list("industries", { limit: 1000 });

  if (error) {
    const message = error.message?.toLowerCase?.() ?? "";
    if (message.includes("bucket") && message.includes("not")) {
      return null;
    }
    return error;
  }

  const files = (data ?? [])
    .filter((item) => item.name)
    .map((item) => `industries/${item.name}`);

  if (!files.length) {
    return null;
  }

  const { error: removeError } = await supabaseAdmin.storage
    .from(bucket)
    .remove(files);

  return removeError ?? null;
};

export async function POST(request: Request) {
  const admin = await getAdminUser(request);
  if (!admin.ok) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: admin.status },
    );
  }

  const imageError = await deleteIndustryImages();
  if (imageError) {
    return NextResponse.json(
      { message: imageError.message || "Failed to clear industry images." },
      { status: 500 },
    );
  }

  const { error } = await supabaseAdmin
    .from("industries")
    .delete()
    .not("id", "is", null);

  if (error) {
    return NextResponse.json(
      { message: "Failed to clear industries.", details: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({
    message: "Industries cleared.",
  });
}
