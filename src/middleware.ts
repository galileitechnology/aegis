import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const authCookie = req.cookies.get("authjs.session-token");
  const loginPage = req.nextUrl.pathname === "/";
  const dashboardPage = req.nextUrl.pathname.startsWith("/dashboard");

  if (!authCookie && dashboardPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (authCookie && loginPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/dashboard"],
};
