import { IUrlRepository } from "../repositories/url.repository";
import { AppError } from "../utils/appError";
import { HTTP_STATUS, MESSAGES } from "../constants";
import crypto from "crypto";

export interface IUrlService {
  shorten(originalUrl: string, userId: string): Promise<any>;
  getOriginalUrl(shortCode: string): Promise<string>;
  getHistory(userId: string): Promise<any[]>;
}

export class UrlService implements IUrlService {
  private urlRepository: IUrlRepository;

  constructor(urlRepository: IUrlRepository) {
    this.urlRepository = urlRepository;
  }

  async getHistory(userId: string) {
    return this.urlRepository.findByUserId(userId);
  }

  async shorten(originalUrl: string, userId: string) {
    // Basic URL validation
    try {
      new URL(originalUrl);
    } catch (e) {
      throw new AppError("Invalid URL format", HTTP_STATUS.BAD_REQUEST);
    }

    // Generate a unique 6-character short code
    const shortCode = crypto.randomBytes(3).toString("hex");

    const newUrl = await this.urlRepository.create({
      originalUrl,
      shortCode,
      userId: userId as any,
    });

    return newUrl;
  }

  async getOriginalUrl(shortCode: string) {
    const urlDoc = await this.urlRepository.findByShortCode(shortCode);
    
    if (!urlDoc) {
      throw new AppError("URL not found", HTTP_STATUS.NOT_FOUND);
    }

    // Background task to increment clicks
    this.urlRepository.incrementClicks(shortCode);

    return urlDoc.originalUrl;
  }
}
