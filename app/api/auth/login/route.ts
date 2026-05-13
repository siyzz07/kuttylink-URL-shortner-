import { authControllerInstance } from '@/backend/di/auth.container';

export async function POST(req: Request) {
  return authControllerInstance.login(req);
}
