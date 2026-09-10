/**
 * Token Storage Utility
 * Module: utils/tokenStorage.js
 * 
 * Provides an isolated, safe abstraction for persisting and retrieving
 * authentication tokens and administrator profile data.
 * Designed to easily support future storage strategies (e.g., Secure Cookies,
 * encrypted storage) without touching consuming services or components.
 */

const TOKEN_KEY = 'ms_auth_token';
const ADMIN_KEY = 'ms_auth_admin';

// In-memory fallback if localStorage is unavailable (e.g. privacy mode)
const memoryStorage = new Map();

const isStorageAvailable = () => {
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

const storageAvailable = typeof window !== 'undefined' && isStorageAvailable();

export const tokenStorage = {
  /**
   * Save the JWT token string
   * @param {string} token
   */
  saveToken(token) {
    if (!token) return;
    try {
      if (storageAvailable) {
        window.localStorage.setItem(TOKEN_KEY, token);
      } else {
        memoryStorage.set(TOKEN_KEY, token);
      }
    } catch (err) {
      if (import.meta?.env?.DEV) {
        console.warn('Failed to save token to localStorage, using memory fallback:', err);
      }
      memoryStorage.set(TOKEN_KEY, token);
    }
  },

  /**
   * Retrieve the current JWT token
   * @returns {string|null}
   */
  getToken() {
    try {
      if (storageAvailable) {
        return window.localStorage.getItem(TOKEN_KEY) || memoryStorage.get(TOKEN_KEY) || null;
      }
      return memoryStorage.get(TOKEN_KEY) || null;
    } catch {
      return memoryStorage.get(TOKEN_KEY) || null;
    }
  },

  /**
   * Remove the stored JWT token
   */
  removeToken() {
    try {
      if (storageAvailable) {
        window.localStorage.removeItem(TOKEN_KEY);
      }
      memoryStorage.delete(TOKEN_KEY);
    } catch {
      memoryStorage.delete(TOKEN_KEY);
    }
  },

  /**
   * Check if a token currently exists in storage
   * @returns {boolean}
   */
  hasToken() {
    return Boolean(this.getToken());
  },

  /**
   * Save administrator profile details
   * @param {Object} admin
   */
  saveAdmin(admin) {
    if (!admin) return;
    try {
      const payload = JSON.stringify(admin);
      if (storageAvailable) {
        window.localStorage.setItem(ADMIN_KEY, payload);
      } else {
        memoryStorage.set(ADMIN_KEY, payload);
      }
    } catch (err) {
      if (import.meta?.env?.DEV) {
        console.warn('Failed to save admin profile to localStorage:', err);
      }
      memoryStorage.set(ADMIN_KEY, JSON.stringify(admin));
    }
  },

  /**
   * Retrieve administrator profile details
   * @returns {Object|null}
   */
  getAdmin() {
    try {
      const raw = storageAvailable
        ? window.localStorage.getItem(ADMIN_KEY) || memoryStorage.get(ADMIN_KEY)
        : memoryStorage.get(ADMIN_KEY);

      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  /**
   * Remove administrator profile details
   */
  removeAdmin() {
    try {
      if (storageAvailable) {
        window.localStorage.removeItem(ADMIN_KEY);
      }
      memoryStorage.delete(ADMIN_KEY);
    } catch {
      memoryStorage.delete(ADMIN_KEY);
    }
  },

  /**
   * Completely clear all authentication-related storage entries
   */
  clearAll() {
    this.removeToken();
    this.removeAdmin();
    // Also clean any legacy keys if present
    try {
      if (storageAvailable) {
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('user');
      }
    } catch {
      // Ignored
    }
  },
};

export default tokenStorage;
