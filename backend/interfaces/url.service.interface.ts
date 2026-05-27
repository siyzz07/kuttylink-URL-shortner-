export interface IUrlService {
  shorten(originalUrl: string, userId: string): Promise<any>;
  getOriginalUrl(shortCode: string): Promise<string>;
  getHistory(userId: string): Promise<any[]>;
}
