import { NextResponse } from 'next/server';
import { IAuthService } from '../interfaces/auth.service.interface';
import { HTTP_STATUS, MESSAGES } from '../constants';

export class AuthController {
  constructor(private authService: IAuthService) {}

  async signup(req: Request) {
    try {
      const body = await req.json();
      
      if (!body.name || !body.email || !body.password) {
        return NextResponse.json(
          { error: MESSAGES.MISSING_REQUIRED_FIELDS },
          { status: HTTP_STATUS.BAD_REQUEST }
        );
      }

      const user = await this.authService.registerUser(body);
      
      return NextResponse.json(
        { message: MESSAGES.USER_REGISTERED_SUCCESS, user },
        { status: HTTP_STATUS.CREATED }
      );
    } catch (error: any) {
      console.error('Signup Controller Error:', error.message);
      
      if (error.message === MESSAGES.USER_ALREADY_EXISTS) {
        return NextResponse.json(
          { error: error.message },
          { status: HTTP_STATUS.CONFLICT }
        );
      }
      
      return NextResponse.json(
        { error: MESSAGES.INTERNAL_SERVER_ERROR },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }
  }

  async login(req: Request) {
    try {
      const body = await req.json();

      if (!body.email || !body.password) {
        return NextResponse.json(
          { error: MESSAGES.MISSING_REQUIRED_FIELDS },
          { status: HTTP_STATUS.BAD_REQUEST }
        );
      }

      const user = await this.authService.loginUser(body);

      return NextResponse.json(
        { message: MESSAGES.LOGIN_SUCCESS, user },
        { status: HTTP_STATUS.OK }
      );
    } catch (error: any) {
      console.error('Login Controller Error:', error.message);

      if (error.message === MESSAGES.INVALID_CREDENTIALS) {
        return NextResponse.json(
          { error: error.message },
          { status: HTTP_STATUS.UNAUTHORIZED }
        );
      }

      return NextResponse.json(
        { error: MESSAGES.INTERNAL_SERVER_ERROR },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }
  }
}
