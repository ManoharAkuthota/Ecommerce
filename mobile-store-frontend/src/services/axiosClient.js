/**
 * Centralized Axios HTTP Client
 * Module: services/axiosClient.js
 * 
 * Configured Axios instance with request and response interceptors:
 * - Automatically attaches Authorization Bearer headers for authenticated requests
 * - Intercepts 401 responses, clears stale sessions, and triggers automatic logout
 */

import axios from 'axios';
import { tokenStorage } from '../utils/tokenStorage';
import { isTokenExpired } from '../utils/jwtUtils';

const getEffectiveApiBase = () => {
  const envUrl = typeof import.meta !== 'undefined' && (import.meta?.env?.VITE_API_BASE_URL || import.meta?.env?.VITE_API_URL);
  if (envUrl && envUrl.trim() && !envUrl.includes('localhost')) {
    return envUrl.trim();
  }
  // If running in browser on cloud (Render / Vercel / Netlify / custom domain)
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://ms-mobiles-backend.onrender.com/api';
  }
  return envUrl || 'http://localhost:8080/api';
};

const rawBase = getEffectiveApiBase();

const getNormalizedApiBase = () => {
  let url = (rawBase || '').trim();
  if (!url) return 'http://localhost:8080/api';
  url = url.replace(/\/+$/, '');
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }
  if (!url.endsWith('/api')) {
    url = `${url}/api`;
  }
  return url;
};

const API_BASE_URL = getNormalizedApiBase();

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Listener callback invoked on 401 Unauthorized or expired token detection
let onUnauthorizedCallback = null;

/**
 * Register an unauthorized callback (e.g. from AuthContext) to update React state
 * and trigger smooth redirects without circular dependencies.
 * 
 * @param {Function} callback
 */
export const setUnauthorizedCallback = (callback) => {
  onUnauthorizedCallback = callback;
};

// ==========================================
// Request Interceptor: Attach Bearer Token
// ==========================================
axiosClient.interceptors.request.use(
  (config) => {
    // Only attach admin Bearer token if Authorization header is not explicitly set by the caller
    if (!config.headers.Authorization) {
      const token = tokenStorage.getToken();

      if (token) {
        // Proactively check for token expiration before issuing request
        if (isTokenExpired(token)) {
          if (import.meta?.env?.DEV) {
            console.warn('[axiosClient] Stored admin token is expired. Clearing session.');
          }
          tokenStorage.clearAll();
          if (typeof onUnauthorizedCallback === 'function') {
            onUnauthorizedCallback({ reason: 'expired' });
          }
        } else {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ==========================================
// Response Interceptor: 401 Unauthorized Handler
// ==========================================
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      const url = error?.config?.url || '';
      // Only clear admin session if 401 occurred on an administrative endpoint
      const isAdminEndpoint = url.includes('/admin/') || url.includes('/admin-');

      if (isAdminEndpoint) {
        if (import.meta?.env?.DEV) {
          console.warn('[axiosClient] 401 Unauthorized received on admin request. Clearing admin session.');
        }
        tokenStorage.clearAll();

        if (typeof onUnauthorizedCallback === 'function') {
          onUnauthorizedCallback({
            reason: 'unauthorized',
            path: error?.response?.data?.path || null,
            message: error?.response?.data?.message || 'Session expired or unauthorized',
          });
        }
      } else if (import.meta?.env?.DEV) {
        console.warn('[axiosClient] 401 on customer endpoint ignored by admin session handler:', url);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
