/**
 * Enterprise Authentication Context
 * Module: context/AuthContext.jsx
 * 
 * Provides centralized authentication state, session restoration,
 * automatic 401 logout handling, and token management across the application.
 */

import React, { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import { setUnauthorizedCallback } from '../services/axiosClient';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Centralized logout procedure
   */
  const logout = useCallback(() => {
    authService.logout();
    setAdmin(null);
    setToken(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  /**
   * Session Restoration on initial application mount
   */
  useEffect(() => {
    try {
      const session = authService.getCurrentSession();
      if (session.isAuthenticated) {
        setToken(session.token);
        setAdmin(session.admin);
        setIsAuthenticated(true);
      } else {
        setToken(null);
        setAdmin(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      if (import.meta?.env?.DEV) {
        console.warn('[AuthContext] Error during session restoration:', err);
      }
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  /**
   * Register Axios 401 unauthorized interceptor callback
   */
  useEffect(() => {
    setUnauthorizedCallback(({ reason, message }) => {
      if (import.meta?.env?.DEV) {
        console.warn(`[AuthContext] Auto-logout triggered. Reason: ${reason}`);
      }
      setAdmin(null);
      setToken(null);
      setIsAuthenticated(false);
      if (reason === 'expired') {
        setError('Your session has expired. Please log in again.');
      }
    });
  }, []);

  /**
   * Authenticate administrator credentials
   * 
   * @param {string|Object} emailOrCredentials
   * @param {string} [password]
   * @returns {Promise<Object>}
   */
  const login = useCallback(async (emailOrCredentials, password) => {
    setIsLoading(true);
    setError(null);

    let credentials;
    if (typeof emailOrCredentials === 'object' && emailOrCredentials !== null) {
      credentials = emailOrCredentials;
    } else {
      credentials = { email: emailOrCredentials, password };
    }

    try {
      const data = await authService.login(credentials);
      
      const adminProfile = {
        name: data.adminName || 'Store Administrator',
        email: data.email || credentials.email,
        role: 'ROLE_ADMIN',
        expiresAt: data.expiresAt || null,
      };

      setToken(data.token);
      setAdmin(adminProfile);
      setIsAuthenticated(true);
      setError(null);

      return data;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Authentication failed. Please verify your credentials.';
      
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const contextValue = {
    // Current identity
    admin,
    user: admin, // Alias for backward compatibility
    token,
    
    // Status flags
    isAuthenticated,
    isAdmin: isAuthenticated,
    isLoading,
    loading: isLoading, // Alias for backward compatibility
    error,

    // Actions
    login,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
