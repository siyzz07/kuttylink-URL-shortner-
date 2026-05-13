import axiosInstance from './axiosInstance';

/**
 * Real API call to login a user using the custom Axios Instance
 */
export const loginUser = async (credentials: any) => {
  try {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.error || 'Login failed';
    throw new Error(message);
  }
};

/**
 * Real API call to register a user using the custom Axios Instance
 */
export const registerUser = async (userData: any) => {
  try {
    const response = await axiosInstance.post('/auth/signup', userData);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.error || 'Registration failed';
    throw new Error(message);
  }
};

/**
 * Simulates shortening a URL API call
 */
export const shortenUrl = async (longUrl: string) => {
  return new Promise<{ shortUrl: string }>((resolve) => {
    setTimeout(() => {
      console.log("API Layer: Shortening URL", longUrl);
      resolve({ shortUrl: "http://localhost:3000/xyz123" });
    }, 1500);
  });
};
