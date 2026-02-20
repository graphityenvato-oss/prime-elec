import { NextResponse } from "next/server";

import { getIndustriesDb } from "@/lib/industries-data-db";

export async function GET() {
  try {
    const industries = await getIndustriesDb();
    return NextResponse.json({
      industries: industries.map((industry) => ({
        slug: industry.slug,
        title: industry.title,
        image: industry.image ?? "/images/placeholder/imageholder.webp",
      })),
    });
  } catch {
    return NextResponse.json({ industries: [] }, { status: 500 });
  }
}
