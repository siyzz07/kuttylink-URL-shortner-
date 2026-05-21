import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";
import { ROUTES } from "@/backend/constants";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isGuestRoute = pathname === ROUTES.LOGIN || pathname === ROUTES.SIGNUP;
  const isProtectedRoute = pathname.startsWith(ROUTES.HOME) || pathname.startsWith("/dashboard");

  if (!isGuestRoute && !isProtectedRoute) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  let isValidUser = false;
  let newAccessToken: string | null = null;

  if (accessToken) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret");
      await jose.jwtVerify(accessToken, secret);
      isValidUser = true;
    } catch (err: any) {
      console.log("Access token invalid or expired. Attempting to refresh using refresh token...");
    }
  }

  if (!isValidUser && refreshToken) {
    try {
      const refreshSecret = new TextEncoder().encode(
        process.env.JWT_REFRESH_SECRET || "refresh_fallback_secret"
      );
      const { payload: refreshPayload } = await jose.jwtVerify(refreshToken, refreshSecret);

      const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret");
      newAccessToken = await new jose.SignJWT({
        id: refreshPayload.id,
        email: refreshPayload.email,
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("15m")
        .sign(secret);

      isValidUser = true;
      console.log("Successfully generated a new access token via refresh token.");
    } catch (err: any) {
      console.log("Refresh token invalid or expired.");
    }
  }

  if (!isValidUser && isProtectedRoute) {
    const loginUrl = new URL(ROUTES.LOGIN, request.url);
    const response = NextResponse.redirect(loginUrl);
    
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
    return response;
  }

  if (isValidUser && isGuestRoute) {
    const homeUrl = new URL(ROUTES.HOME, request.url);
    const response = NextResponse.redirect(homeUrl);

    if (newAccessToken) {
      response.cookies.set("access_token", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60,
        path: "/",
      });
    }
    return response;
  }

  let response = NextResponse.next();

  if (newAccessToken) {
    const requestHeaders = new Headers(request.headers);
    
    let cookiesStr = `access_token=${newAccessToken}`;
    request.cookies.getAll().forEach((cookie) => {
      if (cookie.name !== "access_token") {
        cookiesStr += `; ${cookie.name}=${cookie.value}`;
      }
    });
    requestHeaders.set("cookie", cookiesStr);

    response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    response.cookies.set("access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60,
      path: "/",
    });
  }

  return response;
}

export const config = {
  matcher: ["/login", "/signup", "/home/:path*", "/dashboard/:path*"],
};
