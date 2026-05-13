import { authControllerInstance } from '@/backend/di/auth.container';

export async function POST(req: Request) {
  // The route simply delegates to the pre-wired controller
  return authControllerInstance.signup(req);
}
