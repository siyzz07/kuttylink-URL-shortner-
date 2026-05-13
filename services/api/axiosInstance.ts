import axios from 'axios';

/**
 * Professional Axios Instance Configuration
 * Centralizing the configuration makes it easy to add interceptors,
 * base URLs, and headers in one place.
 */
const axiosInstance = axios.create({
  baseURL: '/api', // Base path for all API routes
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Optional: 10 second timeout
});

// You can add interceptors here later (e.g., for attaching JWT tokens)
// axiosInstance.interceptors.request.use(...)

export default axiosInstance;
