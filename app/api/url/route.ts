import { urlControllerInstance } from "@/backend/di/service.di";

export async function GET(req: Request) {
  return urlControllerInstance.getHistory(req);
}
