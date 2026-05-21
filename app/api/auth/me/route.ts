import { authControllerInstance } from '@/backend/di/service.di';

export async function GET(req: Request) {
  return authControllerInstance.me(req);
}
