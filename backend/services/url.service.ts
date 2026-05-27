import { IUrlRepository } from "../repositories/url.repository";
import { IUrlService } from "../interfaces/url.service.interface";
import { AppError } from "../utils/appError";
import { HTTP_STATUS, MESSAGES } from "../constants";
import crypto from "crypto";

export class UrlService implements IUrlService {
  private urlRepository: IUrlRepository;

  constructor(urlRepository: IUrlRepository) {
    this.urlRepository = urlRepository;
  }

  async getHistory(userId: string) {
    return this.urlRepository.findByUserId(userId);
  }

  async shorten(originalUrl: string, userId: string) {

    try {
      new URL(originalUrl);
    } catch (e) {
      throw new AppError("Invalid URL format", HTTP_STATUS.BAD_REQUEST);
    }

  
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
