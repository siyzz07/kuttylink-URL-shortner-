import { urlControllerInstance } from "@/backend/di/service.di";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest,{ params }: { params: { shortCode: string } }
) {
  const { shortCode } = await params;
  console.log(shortCode,'shor');
  return urlControllerInstance.redirect(shortCode);
}
