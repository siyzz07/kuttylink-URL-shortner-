export interface IAuthService {
  registerUser(userData: any): Promise<{ id: any; name: string; email: string }>;
  loginUser(credentials: any): Promise<{ id: any; name: string; email: string; accessToken: string; refreshToken: string }>;
}
