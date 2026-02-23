import { NextResponse } from "next/server";
import { z } from "zod";

import { buildBoqEmailContent } from "@/lib/notifications/boq-email";
import { canSendWithResend, sendResendEmail } from "@/lib/notifications/resend";
import { rateLimit } from "@/lib/rate-limit";
import { supabaseAdmin } from "@/lib/supabase/admin";

const payloadSchema = z.object({
  fullName: z.string().min(1),
  phone: z.string().min(1),
  projectName: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  startedAt: z.coerce.number().optional(),
});

const ALLOWED_BOQ_EXTENSIONS = new Set([".pdf", ".xls", ".xlsx", ".csv"]);

const ALLOWED_BOQ_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
  "application/csv",
  "application/octet-stream", // some browsers upload excel files as octet-stream
]);

const MIN_FORM_FILL_MS = 3_000;

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rate = rateLimit({
    key: `boq:${ip}`,
    limit: 4,
    windowMs: 10 * 60_000,
  });

  if (!rate.allowed) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((rate.retryAfter ?? 60_000) / 1000),
    );
    return NextResponse.json(
      { message: "Too many BOQ uploads. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfterSeconds) },
      },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  const payload = payloadSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    projectName: formData.get("projectName"),
    notes: formData.get("notes"),
    website: formData.get("website"),
    startedAt: formData.get("startedAt"),
  });

  if (!payload.success) {
    return NextResponse.json(
      { message: "Name and phone are required." },
      { status: 400 },
    );
  }

  const tooFast = payload.data.startedAt
    ? Date.now() - payload.data.startedAt < MIN_FORM_FILL_MS
    : false;
  const hasHoneypot = Boolean(payload.data.website?.trim());
  if (hasHoneypot || tooFast) {
    return NextResponse.json({ status: "ok" }, { status: 201 });
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "File is required." }, { status: 400 });
  }

  const extensionMatch = file.name.toLowerCase().match(/\.[a-z0-9]+$/);
  const fileExtension = extensionMatch?.[0] ?? "";
  if (!ALLOWED_BOQ_EXTENSIONS.has(fileExtension)) {
    return NextResponse.json(
      {
        message: "Unsupported file type. Allowed formats: PDF, XLS, XLSX, CSV.",
      },
      { status: 400 },
    );
  }

  if (file.type && !ALLOWED_BOQ_MIME_TYPES.has(file.type)) {
    return NextResponse.json(
      {
        message:
          "Unsupported file MIME type. Allowed formats: PDF, XLS, XLSX, CSV.",
      },
      { status: 400 },
    );
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

  if (canSendWithResend()) {
    const notifyTo =
      process.env.BOQ_NOTIFY_EMAIL ||
      process.env.NOTIFY_EMAIL_TO ||
      "info@prime-elec.com";
    const { subject, html, text } = buildBoqEmailContent({
      fullName: payload.data.fullName,
      phone: payload.data.phone,
      projectName: payload.data.projectName ?? null,
      notes: payload.data.notes ?? null,
      fileName: safeName,
      fileUrl: publicUrlData.publicUrl,
    });

    try {
      await sendResendEmail({
        to: notifyTo,
        subject,
        html,
        text,
      });
    } catch (emailError) {
      console.error("BOQ email notification failed:", emailError);
    }
  }

  return NextResponse.json({ status: "ok" }, { status: 201 });
}
