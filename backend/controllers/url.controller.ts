import { IUrlService } from "../services/url.service";
import { NextResponse } from "next/server";
import { HTTP_STATUS, MESSAGES } from "../constants";
import { globalErrorHandler } from "../utils/errorHandler";
import jwt from "jsonwebtoken";

export class UrlController {
  private urlService: IUrlService;

  constructor(urlService: IUrlService) {
    this.urlService = urlService;
  }

  async shorten(req: Request) {
    try {
      // 1. Get the user from the access token (Authentication check)
      const cookieHeader = req.headers.get("cookie");
      const token = cookieHeader
        ?.split("; ")
        .find((row) => row.startsWith("access_token="))
        ?.split("=")[1];

      if (!token) {
        return NextResponse.json(
          { error: MESSAGES.AUTH_REQUIRED },
          { status: HTTP_STATUS.UNAUTHORIZED }
        );
      }

      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
      const userId = decoded.id;

      // 2. Get the long URL from the body
      const body = await req.json();
      const { url } = body;

      if (!url) {
        return NextResponse.json(
          { error: "URL is required" },
          { status: HTTP_STATUS.BAD_REQUEST }
        );
      }

      // 3. Shorten it
      const newUrl = await this.urlService.shorten(url, userId);

      // 4. Return the full short URL
      const host = req.headers.get("host");
      const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
      const shortUrl = `${protocol}://${host}/${newUrl.shortCode}`;

      return NextResponse.json(
        { 
          message: MESSAGES.URL_SHORTEN_SUCCESS, 
          shortUrl,
          originalUrl: newUrl.originalUrl 
        },
        { status: HTTP_STATUS.CREATED }
      );
    } catch (error: any) {
      return globalErrorHandler(error);
    }
  }

  async getHistory(req: Request) {
    try {
      const cookieHeader = req.headers.get("cookie");
      const token = cookieHeader
        ?.split("; ")
        .find((row) => row.startsWith("access_token="))
        ?.split("=")[1];

      if (!token) {
        return NextResponse.json(
          { error: MESSAGES.AUTH_REQUIRED },
          { status: HTTP_STATUS.UNAUTHORIZED }
        );
      }

      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
      const userId = decoded.id;

      const history = await this.urlService.getHistory(userId);

      // Add full short URL to each item
      const host = req.headers.get("host");
      const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
      
      const formattedHistory = history.map(item => ({
        ...item.toObject(),
        shortUrl: `${protocol}://${host}/${item.shortCode}`
      }));

      return NextResponse.json({ history: formattedHistory }, { status: HTTP_STATUS.OK });
    } catch (error: any) {
      return globalErrorHandler(error);
    }
  }

  async redirect(shortCode: string) {
    try {
      const originalUrl = await this.urlService.getOriginalUrl(shortCode);
      return NextResponse.redirect(new URL(originalUrl));
    } catch (error: any) {
      return globalErrorHandler(error);
    }
  }
}
