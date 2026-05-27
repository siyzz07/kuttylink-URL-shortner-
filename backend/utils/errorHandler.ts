import { NextResponse } from 'next/server';
import { AppError } from './appError';
import { HTTP_STATUS, MESSAGES } from '../constants';


export const globalErrorHandler = (error: any) => {
  console.error("--- GLOBAL ERROR LOG ---");
  console.error("Message:", error.message);
  console.error("Stack:", error.stack);
  console.error("------------------------");


  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode }
    );
  }

  if (error.name === 'ValidationError') {
    return NextResponse.json(
      { error: "Validation failed: " + error.message },
      { status: HTTP_STATUS.BAD_REQUEST }
    );
  }

  if (error.code === 11000) {
    return NextResponse.json(
      { error: MESSAGES.USER_ALREADY_EXISTS },
      { status: HTTP_STATUS.CONFLICT }
    );
  }

  return NextResponse.json(
    { error: MESSAGES.INTERNAL_SERVER_ERROR },
    { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
  );
};
