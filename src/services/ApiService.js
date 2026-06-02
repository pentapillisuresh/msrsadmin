// services/api.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor → attach token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor → handle token refresh
apiClient.interceptors.response.use(
  (response) => response.data,

  async (error) => {
    const originalRequest = error.config;

    // Token expired
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data.message === 'Token expired' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshed = await refreshAccessToken();

      if (refreshed) {
        const newToken = localStorage.getItem('accessToken');

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return apiClient(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

// Refresh token function
async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) return false;

  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/refresh-token`,
      { refreshToken },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const data = response.data;

    if (data.success) {
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);

      return true;
    }

    return false;
  } catch (error) {
    console.error('Refresh Token Error:', error);

    // Optional: logout user
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    return false;
  }
}

// API methods
export const api = {
  get: (url, config = {}) => apiClient.get(url, config),

  post: (url, data, config = {}) =>
    apiClient.post(url, data, config),

  put: (url, data, config = {}) =>
    apiClient.put(url, data, config),

  delete: (url, config = {}) =>
    apiClient.delete(url, config)
};