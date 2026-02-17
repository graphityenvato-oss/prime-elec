import { NextResponse } from "next/server";
import { z } from "zod";

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
  cartItems: z.array(cartItemSchema).min(1),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = quotationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid quotation payload." },
      { status: 400 },
    );
  }

  const payload = parsed.data;
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

  return NextResponse.json({ status: "ok" }, { status: 201 });
}
