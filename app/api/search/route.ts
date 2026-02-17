import { NextResponse } from "next/server";

import { rateLimit } from "@/lib/rate-limit";
import { performSearch } from "@/lib/search-engine";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for") ?? "";
  const ip = forwardedFor.split(",")[0]?.trim() || "unknown";
  const limiter = rateLimit({
    key: `search:${ip}`,
    limit: 60,
    windowMs: 60_000,
  });
  if (!limiter.allowed) {
    return NextResponse.json(
      { message: "Too many search requests. Please slow down." },
      { status: 429 },
    );
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const limit = Number(searchParams.get("limit") ?? "6");
  const safeLimit =
    Number.isFinite(limit) && limit > 0 ? Math.min(Math.floor(limit), 20) : 6;

  if (!q) {
    return NextResponse.json({
      query: "",
      stockProducts: [],
      stockCategories: [],
      stockSubcategories: [],
      external: [],
      totals: {
        stockProducts: 0,
        stockCategories: 0,
        stockSubcategories: 0,
        external: 0,
      },
    });
  }

  try {
    const results = await performSearch(q, {
      limitProducts: safeLimit,
      limitCategories: safeLimit,
      limitSubcategories: safeLimit,
      limitExternal: safeLimit,
    });
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to execute search query.",
      },
      { status: 500 },
    );
  }
}
