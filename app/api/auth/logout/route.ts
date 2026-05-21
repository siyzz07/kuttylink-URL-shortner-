import { authControllerInstance } from '@/backend/di/service.di';

export async function POST() {
  return authControllerInstance.logout();
}
