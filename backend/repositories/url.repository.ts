import { connectToDatabase } from "../lib/db";
import { UrlModel, IUrl } from "../models/url.model";

export interface IUrlRepository {
  create(urlData: Partial<IUrl>): Promise<IUrl>;
  findByShortCode(shortCode: string): Promise<IUrl | null>;
  incrementClicks(shortCode: string): Promise<void>;
  findByUserId(userId: string): Promise<IUrl[]>;
}

export class UrlRepository implements IUrlRepository {
  async create(urlData: Partial<IUrl>): Promise<IUrl> {
    await connectToDatabase();
    const newUrl = new UrlModel(urlData);
    return newUrl.save();
  }

  async findByShortCode(shortCode: string): Promise<IUrl | null> {
    await connectToDatabase();
    return UrlModel.findOne({ shortCode }).exec();
  }

  async incrementClicks(shortCode: string): Promise<void> {
    await connectToDatabase();
    await UrlModel.updateOne({ shortCode }, { $inc: { clicks: 1 } }).exec();
  }

  async findByUserId(userId: string): Promise<IUrl[]> {
    await connectToDatabase();
    return UrlModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }
}
