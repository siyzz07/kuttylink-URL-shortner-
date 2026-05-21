import { urlControllerInstance } from "@/backend/di/service.di";

export async function POST(req: Request) {
  return urlControllerInstance.shorten(req);
}
