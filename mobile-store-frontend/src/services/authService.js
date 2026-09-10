/**
 * Authentication Service
 * Module: services/authService.js
 * 
 * Handles network calls and high-level workflows for authentication.
 * Keeps networking strictly decoupled from React UI components.
 */

import axiosClient from './axiosClient';
import { tokenStorage } from '../utils/tokenStorage';
import { isTokenExpired, decodeToken } from '../utils/jwtUtils';

export const authService = {
  /**
   * Authenticate administrator against Spring Boot backend
   * 
   * @param {Object} credentials
   * @param {string} credentials.email
   * @param {string} credentials.password
   * @returns {Promise<{token: string, tokenType: string, adminName: string, email: string, expiresAt: string}>}
   */
  async login({ email, password }) {
    const response = await axiosClient.post('/admin/login', {
      email: email?.trim(),
      password,
    });

    const data = response.data;

    if (data?.token) {
      tokenStorage.saveToken(data.token);
      tokenStorage.saveAdmin({
        name: data.adminName || 'Store Administrator',
        email: data.email || email,
        role: 'ROLE_ADMIN',
        expiresAt: data.expiresAt || null,
      });
    }

    return data;
  },

  /**
   * Clears stored credentials and terminates active session
   */
  logout() {
    tokenStorage.clearAll();
  },

  /**
   * Inspects client storage to reconstruct active session
   * 
   * @returns {{ isAuthenticated: boolean, token: string|null, admin: Object|null }}
   */
  getCurrentSession() {
    const token = tokenStorage.getToken();
    const admin = tokenStorage.getAdmin();

    if (!token || isTokenExpired(token)) {
      if (token) {
        tokenStorage.clearAll();
      }
      return {
        isAuthenticated: false,
        token: null,
        admin: null,
      };
    }

    // Fallback: If admin metadata was missing from storage, reconstruct from JWT payload
    const effectiveAdmin = admin || {
      name: 'Administrator',
      email: decodeToken(token)?.sub || '',
      role: 'ROLE_ADMIN',
    };

    return {
      isAuthenticated: true,
      token,
      admin: effectiveAdmin,
    };
  },
};

export default authService;
