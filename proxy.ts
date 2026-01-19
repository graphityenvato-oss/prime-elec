import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  if (
    isAdminApi &&
    [
      "/api/admin/setup",
      "/api/admin/setup-status",
      "/api/admin/session",
      "/api/admin/logout",
      "/api/admin/me",
      "/api/admin/session-status",
    ].includes(pathname)
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("admin_token")?.value;
  if (!token) {
    const url = new URL("/ns-admin", origin);
    return NextResponse.redirect(url);
  }

  const response = await fetch(`${origin}/api/admin/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const url = new URL("/ns-admin", origin);
    return NextResponse.redirect(url);
  }

  const data = await response.json().catch(() => ({}));
  if (!data?.isAdmin) {
    const url = new URL("/ns-admin", origin);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
