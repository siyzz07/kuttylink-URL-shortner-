export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

export const ROUTES = {
  HOME: "/home",
  LOGIN: "/login",
  SIGNUP: "/signup",
  LANDING: "/",
  API: {
    AUTH: {
      LOGIN: "/api/auth/login",
      SIGNUP: "/api/auth/signup",
      LOGOUT: "/api/auth/logout",
      REFRESH: "/api/auth/refresh",
      ME: "/api/auth/me",
    },
    URL: {
      SHORTEN: "/api/url/shorten",
    }
  }
};

export const MESSAGES = {
  USER_REGISTERED_SUCCESS: 'User registered successfully',
  MISSING_REQUIRED_FIELDS: 'Missing required fields',
  USER_ALREADY_EXISTS: 'User already exists with this email',
  INVALID_CREDENTIALS: 'Invalid email or password',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logged out successfully',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  AUTH_REQUIRED: 'Authentication required',
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
  URL_SHORTEN_SUCCESS: 'URL shortened successfully',
  URL_SHORTEN_FAILED: 'Failed to shorten URL',
};
