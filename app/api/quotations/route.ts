import { NextResponse } from "next/server";
import { z } from "zod";

import { buildQuotationEmailContent } from "@/lib/notifications/quotation-email";
import { buildQuotationPdfAttachment } from "@/lib/notifications/quotation-pdf";
import { canSendWithResend, sendResendEmail } from "@/lib/notifications/resend";
import { rateLimit } from "@/lib/rate-limit";
import { supabaseAdmin } from "@/lib/supabase/admin";

const cartItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  partNumber: z.string().min(1),
  codeNo: z.string().optional(),
  image: z.string().optional(),
  quantity: z.number().int().positive(),
  source: z.enum(["stock", "external"]),
  brand: z.string().optional(),
  category: z.string().optional(),
});

const quotationSchema = z.object({
  fullName: z.string().min(1),
  company: z.string().optional().nullable(),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  projectNotes: z.string().optional().nullable(),
  needsConsultation: z.boolean().optional(),
  website: z.string().optional().nullable(),
  startedAt: z.number().optional(),
  cartItems: z.array(cartItemSchema).min(1),
});

const MIN_FORM_FILL_MS = 3_000;

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rate = rateLimit({
    key: `quotations:${ip}`,
    limit: 6,
    windowMs: 10 * 60_000,
  });

  if (!rate.allowed) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((rate.retryAfter ?? 60_000) / 1000),
    );
    return NextResponse.json(
      { message: "Too many quotation requests. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfterSeconds) },
      },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = quotationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid quotation payload." },
      { status: 400 },
    );
  }

  const payload = parsed.data;
  const startedAt =
    typeof payload.startedAt === "number" && Number.isFinite(payload.startedAt)
      ? payload.startedAt
      : null;
  const tooFast = startedAt ? Date.now() - startedAt < MIN_FORM_FILL_MS : false;
  const hasHoneypot = Boolean(payload.website?.trim());

  if (hasHoneypot || tooFast) {
    return NextResponse.json({ status: "ok" }, { status: 201 });
  }

  const totalItems = payload.cartItems.length;
  const totalQuantity = payload.cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const { error } = await supabaseAdmin.from("quotation_requests").insert({
    full_name: payload.fullName,
    company: payload.company ?? null,
    email: payload.email,
    phone: payload.phone ?? null,
    project_notes: payload.projectNotes ?? null,
    needs_consultation: payload.needsConsultation ?? false,
    cart_items: payload.cartItems,
    total_items: totalItems,
    total_quantity: totalQuantity,
  });

  if (error) {
    return NextResponse.json(
      { message: "Failed to submit quotation request." },
      { status: 500 },
    );
  }

  if (canSendWithResend()) {
    const notifyTo =
      process.env.QUOTATION_NOTIFY_EMAIL ||
      process.env.NOTIFY_EMAIL_TO ||
      "info@prime-elec.com";

    const { subject, html, text } = buildQuotationEmailContent({
      fullName: payload.fullName,
      company: payload.company ?? null,
      email: payload.email,
      phone: payload.phone ?? null,
      projectNotes: payload.projectNotes ?? null,
      needsConsultation: payload.needsConsultation ?? false,
      cartItems: payload.cartItems,
      totalItems,
      totalQuantity,
    });

    try {
      let attachments:
        | Array<{ filename: string; content: string; type?: string }>
        | undefined;
      try {
        const pdfAttachment = await buildQuotationPdfAttachment({
          fullName: payload.fullName,
          company: payload.company ?? null,
          email: payload.email,
          phone: payload.phone ?? null,
          projectNotes: payload.projectNotes ?? null,
          needsConsultation: payload.needsConsultation ?? false,
          cartItems: payload.cartItems,
          totalItems,
          totalQuantity,
        });
        attachments = [pdfAttachment];
      } catch (pdfError) {
        console.error("Quotation PDF generation failed:", pdfError);
      }

      await sendResendEmail({
        to: notifyTo,
        subject,
        html,
        text,
        attachments,
      });
    } catch (emailError) {
      console.error("Quotation email notification failed:", emailError);
    }
  }

  return NextResponse.json({ status: "ok" }, { status: 201 });
}
