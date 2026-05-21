import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api', 
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true, 
});


axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;


    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        
        await axios.post('/api/auth/refresh');
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
