/**
 * Customer Authentication Service
 * Module: services/userAuthService.js
 * 
 * Handles network calls and persistent session storage for Customer accounts.
 * Completely isolated from administrative authentication (`authService.js`).
 */

import axiosClient from './axiosClient';
import { isTokenExpired, decodeToken } from '../utils/jwtUtils';

const USER_TOKEN_KEY = 'ms_user_token';
const USER_PROFILE_KEY = 'ms_user_profile';

// In-memory fallback if localStorage is unavailable
const memoryStorage = new Map();

const isStorageAvailable = () => {
  try {
    const testKey = '__user_storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

const storageAvailable = typeof window !== 'undefined' && isStorageAvailable();

export const userTokenStorage = {
  saveToken(token) {
    if (!token) return;
    try {
      if (storageAvailable) {
        window.localStorage.setItem(USER_TOKEN_KEY, token);
      } else {
        memoryStorage.set(USER_TOKEN_KEY, token);
      }
    } catch {
      memoryStorage.set(USER_TOKEN_KEY, token);
    }
  },

  getToken() {
    try {
      if (storageAvailable) {
        return window.localStorage.getItem(USER_TOKEN_KEY) || memoryStorage.get(USER_TOKEN_KEY) || null;
      }
      return memoryStorage.get(USER_TOKEN_KEY) || null;
    } catch {
      return memoryStorage.get(USER_TOKEN_KEY) || null;
    }
  },

  removeToken() {
    try {
      if (storageAvailable) {
        window.localStorage.removeItem(USER_TOKEN_KEY);
      }
      memoryStorage.delete(USER_TOKEN_KEY);
    } catch {
      memoryStorage.delete(USER_TOKEN_KEY);
    }
  },

  saveProfile(profile) {
    if (!profile) return;
    try {
      const payload = JSON.stringify(profile);
      if (storageAvailable) {
        window.localStorage.setItem(USER_PROFILE_KEY, payload);
      } else {
        memoryStorage.set(USER_PROFILE_KEY, payload);
      }
    } catch {
      memoryStorage.set(USER_PROFILE_KEY, JSON.stringify(profile));
    }
  },

  getProfile() {
    try {
      const raw = storageAvailable
        ? window.localStorage.getItem(USER_PROFILE_KEY) || memoryStorage.get(USER_PROFILE_KEY)
        : memoryStorage.get(USER_PROFILE_KEY);

      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  removeProfile() {
    try {
      if (storageAvailable) {
        window.localStorage.removeItem(USER_PROFILE_KEY);
      }
      memoryStorage.delete(USER_PROFILE_KEY);
    } catch {
      memoryStorage.delete(USER_PROFILE_KEY);
    }
  },

  clearAll() {
    this.removeToken();
    this.removeProfile();
  },

  hasToken() {
    return Boolean(this.getToken());
  },
};

export const userAuthService = {
  /**
   * Authenticate customer with email and password
   * 
   * @param {Object} credentials
   * @param {string} credentials.email
   * @param {string} credentials.password
   * @returns {Promise<Object>}
   */
  async login({ email, password }) {
    const response = await axiosClient.post('/auth/login', {
      email: email?.trim(),
      password,
    });

    const data = response.data;

    if (data?.token) {
      userTokenStorage.saveToken(data.token);

      const userProfile = {
        id: data.id,
        fullName: data.fullName || 'Customer',
        email: data.email || email,
        role: data.role || 'ROLE_USER',
        expiresAt: data.expiresAt || null,
      };

      userTokenStorage.saveProfile(userProfile);
    }

    return data;
  },

  /**
   * Register a new customer account
   * 
   * @param {Object} userData
   * @param {string} userData.fullName
   * @param {string} userData.email
   * @param {string} userData.password
   * @param {string} userData.phoneNumber
   * @returns {Promise<Object>}
   */
  async register({ fullName, email, password, phoneNumber }) {
    const response = await axiosClient.post('/auth/register', {
      fullName: fullName?.trim(),
      email: email?.trim(),
      password,
      phoneNumber: phoneNumber?.trim(),
    });

    return response.data;
  },

  /**
   * Fetch profile for current authenticated customer
   * 
   * @param {string} [tokenOverride]
   * @returns {Promise<Object>}
   */
  async getCurrentUser(tokenOverride = null) {
    const token = tokenOverride || userTokenStorage.getToken();
    if (!token) {
      throw new Error('No user token found in session');
    }

    const response = await axiosClient.get('/account/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const profile = response.data;
    if (profile) {
      userTokenStorage.saveProfile(profile);
    }

    return profile;
  },

  /**
   * Clear active customer session
   */
  logout() {
    userTokenStorage.clearAll();
  },

  /**
   * Inspect storage to reconstruct active customer session
   * 
   * @returns {{ isAuthenticated: boolean, token: string|null, user: Object|null }}
   */
  getCurrentSession() {
    const token = userTokenStorage.getToken();
    const user = userTokenStorage.getProfile();

    if (!token || isTokenExpired(token)) {
      if (token) {
        userTokenStorage.clearAll();
      }
      return {
        isAuthenticated: false,
        token: null,
        user: null,
      };
    }

    const effectiveUser = user || {
      fullName: 'Customer',
      email: decodeToken(token)?.sub || '',
      role: 'ROLE_USER',
    };

    return {
      isAuthenticated: true,
      token,
      user: effectiveUser,
    };
  },
};

export default userAuthService;
