/**
 * Customer Authentication Context
 * Module: context/UserAuthContext.jsx
 * 
 * Centralized state management for Customer/User authentication, registration,
 * session persistence, and token handling.
 * Completely decoupled from Admin AuthContext.
 */

import React, { createContext, useState, useEffect, useCallback } from 'react';
import userAuthService, { userTokenStorage } from '../services/userAuthService';

export const UserAuthContext = createContext(null);

export const UserAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Terminate active customer session
   */
  const logout = useCallback(() => {
    userAuthService.logout();
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  /**
   * Session restoration on mount
   */
  useEffect(() => {
    try {
      const session = userAuthService.getCurrentSession();
      if (session.isAuthenticated) {
        setToken(session.token);
        setUser(session.user);
        setIsAuthenticated(true);

        // Fetch fresh profile in background to keep data updated
        userAuthService
          .getCurrentUser(session.token)
          .then((freshProfile) => {
            if (freshProfile) {
              setUser(freshProfile);
            }
          })
          .catch((err) => {
            if (err?.response?.status === 401) {
              logout();
            }
          });
      } else {
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      if (import.meta?.env?.DEV) {
        console.warn('[UserAuthContext] Error during customer session restoration:', err);
      }
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  /**
   * Customer Login
   * 
   * @param {Object} credentials { email, password }
   * @returns {Promise<Object>}
   */
  const login = useCallback(async ({ email, password }) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await userAuthService.login({ email, password });

      const customerProfile = {
        id: data.id,
        fullName: data.fullName || 'Customer',
        email: data.email || email,
        role: data.role || 'ROLE_USER',
        expiresAt: data.expiresAt || null,
      };

      setToken(data.token);
      setUser(customerProfile);
      setIsAuthenticated(true);
      setError(null);

      return data;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Authentication failed. Please verify your email and password.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Customer Registration
   * 
   * @param {Object} userData { fullName, email, password, phoneNumber }
   * @returns {Promise<Object>}
   */
  const register = useCallback(async (userData) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await userAuthService.register(userData);
      return data;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Registration failed. Please review your details and try again.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Re-fetch latest customer profile from backend and synchronize state
   */
  const refreshUser = useCallback(async () => {
    try {
      const freshProfile = await userAuthService.getCurrentUser();
      if (freshProfile) {
        setUser(freshProfile);
      }
      return freshProfile;
    } catch (err) {
      if (import.meta?.env?.DEV) {
        console.warn('[UserAuthContext] Failed to refresh user profile:', err);
      }
      throw err;
    }
  }, []);

  /**
   * Synchronously update customer profile in state and persistent storage
   * 
   * @param {Object} partialUser
   */
  const updateUser = useCallback((partialUser) => {
    setUser((prev) => {
      const updated = { ...(prev || {}), ...partialUser };
      userTokenStorage.saveProfile(updated);
      return updated;
    });
  }, []);

  const contextValue = {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
    refreshUser,
    updateUser,
  };

  return (
    <UserAuthContext.Provider value={contextValue}>
      {children}
    </UserAuthContext.Provider>
  );
};

export default UserAuthContext;
