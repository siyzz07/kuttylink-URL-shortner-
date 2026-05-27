import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";
import { ROUTES } from "@/backend/constants";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isGuestRoute = pathname === ROUTES.LOGIN || pathname === ROUTES.SIGNUP;
  const isProtectedRoute = pathname.startsWith(ROUTES.HOME) || pathname.startsWith("/dashboard");

  console.log(`[Proxy Interceptor] Path: ${pathname}, isGuest: ${isGuestRoute}, isProtected: ${isProtectedRoute}`);

  if (!isGuestRoute && !isProtectedRoute) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  console.log(`[Proxy Cookies] access_token present: ${!!accessToken}, refresh_token present: ${!!refreshToken}`);
  console.log(`[Proxy Env] JWT_SECRET: ${process.env.JWT_SECRET ? "defined" : "undefined"}, JWT_REFRESH_SECRET: ${process.env.JWT_REFRESH_SECRET ? "defined" : "undefined"}`);

  let isValidUser = false;
  let newAccessToken: string | null = null;

  if (accessToken) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret");
      const result = await jose.jwtVerify(accessToken, secret);
      console.log(`[Proxy] Access token verified successfully. Payload:`, result.payload);
      isValidUser = true;
    } catch (err: any) {
      console.error(`[Proxy] Access token verification failed: ${err.message}`);
      console.log("Access token invalid or expired. Attempting to refresh using refresh token...");
    }
  }

  if (!isValidUser && refreshToken) {
    try {
      const refreshSecret = new TextEncoder().encode(
        process.env.JWT_REFRESH_SECRET || "refresh_fallback_secret"
      );
      const { payload: refreshPayload } = await jose.jwtVerify(refreshToken, refreshSecret);
      console.log(`[Proxy] Refresh token verified successfully. Payload:`, refreshPayload);

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
      console.error(`[Proxy] Refresh token verification failed: ${err.message}`);
      console.log("Refresh token invalid or expired.");
    }
  }

  if (!isValidUser && isProtectedRoute) {
    console.log(`[Proxy] User is NOT valid and path is protected. Redirecting to login.`);
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
