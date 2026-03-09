import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_COOKIE = "jch_admin_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin/* routes except the admin login page itself
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const adminSession = request.cookies.get(ADMIN_COOKIE)?.value;

    if (!adminSession) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
