import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const isProduction = process.env.NODE_ENV === "production";
  const authCookie = req.cookies.get(isProduction ? "__Secure-authjs.session-token" : "authjs.session-token");
  
  const loginPage = req.nextUrl.pathname === "/";
  const dashboardPage = req.nextUrl.pathname.startsWith("/dashboard");
  const chatPage = req.nextUrl.pathname.startsWith("/chat");

  if (!authCookie && (dashboardPage || chatPage)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (authCookie && loginPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/chat/:path*"],
};
