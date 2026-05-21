import axiosInstance from './axiosInstance';


//--------------------------------- login user 
export const loginUser = async (credentials: any) => {
  try {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.error || 'Login failed';
    throw new Error(message);
  }
};


//--------------------------------- register user 
export const registerUser = async (userData: any) => {
  try {
    const response = await axiosInstance.post('/auth/signup', userData);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.error || 'Registration failed';
    throw new Error(message);
  }
};

//--------------------------------- logout user
export const logoutUser = async () => {
  try {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
  } catch (error: any) {
    throw new Error('Logout failed');
  }
};

//--------------------------------- get current user
export const getCurrentUser = async () => {
  try {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  } catch (error: any) {
    return null;
  }
};

//--------------------------------- shorten URL 
export const shortenUrl = async (url: string) => {
  try {
    const response = await axiosInstance.post('/url/shorten', { url });
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.error || 'Failed to shorten URL';
    throw new Error(message);
  }
};

//--------------------------------- get URL history
export const getUrlHistory = async () => {
  try {
    const response = await axiosInstance.get('/url');
    return response.data.history;
  } catch (error: any) {
    return [];
  }
};
