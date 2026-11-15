import axios from 'axios';

// Calculate normalized base API URL
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) return '/api';
  const clean = envUrl.trim().replace(/\/$/, '');
  return clean.endsWith('/api') ? clean : `${clean}/api`;
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 30000, // 30s timeout to accommodate cold starts on serverless / Render free tier
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Authorization Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('c2e_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle unauthenticated 401 response and connection errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized and has an expired token, clear it
      if (localStorage.getItem('c2e_token')) {
        localStorage.removeItem('c2e_token');
        localStorage.removeItem('c2e_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
