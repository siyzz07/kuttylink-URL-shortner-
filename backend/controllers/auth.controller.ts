import { NextResponse } from "next/server";
import { IAuthService } from "../interfaces/auth.service.interface";
import { HTTP_STATUS, MESSAGES } from "../constants";
import { AppError } from "../utils/appError";
import { globalErrorHandler } from "../utils/errorHandler";
import jwt from "jsonwebtoken";

export class AuthController {
  private authService: IAuthService;

  constructor(authService: IAuthService) {
    this.authService = authService;
  }

  async signup(req: Request) {
    try {
      const body = await req.json();
      const { name, email, password } = body;

      if (!name || !email || !password) {
        return NextResponse.json(
          { error: MESSAGES.MISSING_REQUIRED_FIELDS },
          { status: HTTP_STATUS.BAD_REQUEST }
        );
      }

      const user = await this.authService.registerUser({ name, email, password });

      return NextResponse.json(
        { message: MESSAGES.USER_REGISTERED_SUCCESS, user },
        { status: HTTP_STATUS.CREATED }
      );
    } catch (error) {
      return globalErrorHandler(error);
    }
  }

  async login(req: Request) {
    try {
      const body = await req.json();
      const { email, password } = body;

      const { accessToken, refreshToken, ...user } = await this.authService.loginUser({ email, password });
   
      const response = NextResponse.json(
        { message: MESSAGES.LOGIN_SUCCESS, user },
        { status: HTTP_STATUS.OK }
      );

      response.cookies.set("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60,
        path: "/",
      });

      response.cookies.set("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });

      return response;
    } catch (error) {
      return globalErrorHandler(error);
    }
  }

  async logout() {
    const response = NextResponse.json(
      { message: MESSAGES.LOGOUT_SUCCESS },
      { status: HTTP_STATUS.OK }
    );

    response.cookies.set("access_token", "", { maxAge: 0 });
    response.cookies.set("refresh_token", "", { maxAge: 0 });

    return response;
  }

  async refresh(req: Request) {
    const cookieHeader = req.headers.get("cookie");
    const match = cookieHeader?.match(/(^|;)\s*refresh_token=([^;]*)/);
    const refreshToken = match ? match[2] : undefined;

    if (!refreshToken) {
      return NextResponse.json(
        { error: MESSAGES.SESSION_EXPIRED },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    try {
      const decoded: any = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || "refresh_fallback_secret"
      );

      const accessToken = jwt.sign(
        { id: decoded.id, email: decoded.email },
        process.env.JWT_SECRET || "fallback_secret",
        { expiresIn: "15m" }
      );

      const response = NextResponse.json(
        { message: "Token refreshed" },
        { status: HTTP_STATUS.OK }
      );

      response.cookies.set("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60,
        path: "/",
      });

      return response;
    } catch (error) {
      return NextResponse.json(
        { error: MESSAGES.SESSION_EXPIRED },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }
  }

  async me(req: Request) {
    try {
      const cookieHeader = req.headers.get("cookie");
      const match = cookieHeader?.match(/(^|;)\s*access_token=([^;]*)/);
      const token = match ? match[2] : undefined;

      if (!token) {
        return NextResponse.json(
          { error: MESSAGES.AUTH_REQUIRED },
          { status: HTTP_STATUS.UNAUTHORIZED }
        );
      }

      const decoded: any = jwt.verify(
        token,
        process.env.JWT_SECRET || "fallback_secret"
      );
      
      return NextResponse.json({ user: decoded }, { status: HTTP_STATUS.OK });
    } catch (error: any) {
      return NextResponse.json(
        { error: MESSAGES.AUTH_REQUIRED },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }
  }
}
