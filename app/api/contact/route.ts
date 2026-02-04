import { NextResponse } from "next/server";
import { z } from "zod";

import { supabaseAdmin } from "@/lib/supabase/admin";

const contactSchema = z.object({
  fullName: z.string().min(1),
  company: z.string().optional().nullable(),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  partNumber: z.string().optional().nullable(),
  quantity: z.string().optional().nullable(),
  details: z.string().optional().nullable(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid contact payload." },
      { status: 400 },
    );
  }

  const payload = parsed.data;
  const { error } = await supabaseAdmin.from("contact_messages").insert({
    full_name: payload.fullName,
    company: payload.company ?? null,
    email: payload.email,
    phone: payload.phone ?? null,
    part_number: payload.partNumber ?? null,
    quantity: payload.quantity ?? null,
    details: payload.details ?? null,
  });

  if (error) {
    return NextResponse.json(
      { message: "Failed to submit request." },
      { status: 500 },
    );
  }

  return NextResponse.json({ status: "ok" }, { status: 201 });
}
