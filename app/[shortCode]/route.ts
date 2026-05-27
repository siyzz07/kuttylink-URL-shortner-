import { urlControllerInstance } from "@/backend/di/service.di";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  const { shortCode } = await params;
  return urlControllerInstance.redirect(shortCode);
}
