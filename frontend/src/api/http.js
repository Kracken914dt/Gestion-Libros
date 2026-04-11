import axios from 'axios';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('book_app_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('book_app_token');
      localStorage.removeItem('book_app_user');
    }
    return Promise.reject(error);
  },
);

export default http;
