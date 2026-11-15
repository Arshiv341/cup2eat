import axios from 'axios';

// Calculate normalized base API URL, strictly stripping any unintended query params (e.g. ?utm_source=...)
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) {
    // In production, fallback directly to the verified Render production backend
    if (import.meta.env.PROD) {
      return 'https://cup2eatback.onrender.com/api';
    }
    return '/api';
  }

  try {
    if (envUrl.startsWith('http://') || envUrl.startsWith('https://')) {
      const urlObj = new URL(envUrl.trim());
      // Strip any search/query parameters and hash fragments
      urlObj.search = '';
      urlObj.hash = '';
      let pathname = urlObj.pathname.replace(/\/$/, '');
      if (!pathname.endsWith('/api')) {
        pathname = pathname ? `${pathname}/api` : '/api';
      }
      urlObj.pathname = pathname;
      return urlObj.toString().replace(/\/$/, '');
    }
  } catch (e) {
    // Fallback if URL parsing fails
  }

  // Strip query strings from relative or non-standard paths
  const withoutQuery = envUrl.split('?')[0].split('#')[0].trim().replace(/\/$/, '');
  return withoutQuery.endsWith('/api') ? withoutQuery : `${withoutQuery}/api`;
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 30000, // 30s timeout to accommodate cold starts on serverless / Render free tier
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Authorization Bearer token & sanitize outgoing request URLs
api.interceptors.request.use(
  (config) => {
    // Prevent accidental tracking parameters from leaking into API calls
    if (config.params) {
      delete config.params.utm_source;
      delete config.params.utm_medium;
      delete config.params.utm_campaign;
    }

    if (typeof config.url === 'string' && config.url.includes('utm_source')) {
      config.url = config.url.split('?')[0];
    }

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
