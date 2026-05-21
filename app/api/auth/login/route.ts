import { authControllerInstance } from '@/backend/di/service.di';

export async function POST(req: Request) {
  return authControllerInstance.login(req);
}
