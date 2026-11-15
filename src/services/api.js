import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
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

// Interceptor to handle unauthenticated 401 response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized and has an expired token, clear it
      if (localStorage.getItem('c2e_token')) {
        localStorage.removeItem('c2e_token');
        localStorage.removeItem('c2e_user');
        // Do not force redirect if on a public route, let auth context handle state
      }
    }
    return Promise.reject(error);
  }
);

export default api;
