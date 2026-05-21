import { NextResponse } from 'next/server';
import { AppError } from './appError';
import { HTTP_STATUS, MESSAGES } from '../constants';

/**
 * Global Error Handler for API Routes.
 * This centralizes how errors are returned to the client.
 */
export const globalErrorHandler = (error: any) => {
  console.error("--- GLOBAL ERROR LOG ---");
  console.error("Message:", error.message);
  // console.error("Stack:", error.stack);
  console.error("------------------------");

  // 1. Check if it's our custom AppError
  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode }
    );
  }

  // 2. Handle Mongoose Validation Errors
  if (error.name === 'ValidationError') {
    return NextResponse.json(
      { error: "Validation failed: " + error.message },
      { status: HTTP_STATUS.BAD_REQUEST }
    );
  }

  // 3. Handle Mongoose Duplicate Key Errors (e.g., unique email)
  if (error.code === 11000) {
    return NextResponse.json(
      { error: MESSAGES.USER_ALREADY_EXISTS },
      { status: HTTP_STATUS.CONFLICT }
    );
  }

  // 4. Fallback for unexpected errors (Crashes)
  return NextResponse.json(
    { error: MESSAGES.INTERNAL_SERVER_ERROR },
    { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
  );
};
