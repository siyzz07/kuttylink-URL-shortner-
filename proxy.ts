import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { ROUTES } from "@/backend/constants";

export function proxy(request: NextRequest) {
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const { pathname } = request.nextUrl;

  let isValid = false;

  if (refreshToken) {
    try {
      jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || "refresh_fallback_secret");
      isValid = true;
    } catch (error) {
      isValid = false;
    }
  }

  // 1. If user is logged in and tries to access guest routes (login/signup)
  if (isValid && (pathname === ROUTES.LOGIN || pathname === ROUTES.SIGNUP)) {
    return NextResponse.redirect(new URL(ROUTES.HOME, request.url));
  }

  // 2. If user is NOT logged in and tries to access protected routes
  if (!isValid && (pathname.startsWith(ROUTES.HOME) || pathname.startsWith("/dashboard"))) {
    return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/signup", "/home/:path*", "/dashboard/:path*"],
};
