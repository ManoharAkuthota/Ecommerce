/**
 * Custom Authentication Hook
 * Module: hooks/useAuth.js
 * 
 * Provides easy, type-safe access to the AuthContext state and functions.
 * Throws a helpful developer error if invoked outside the AuthProvider tree.
 */

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider. Ensure your component tree is wrapped with <AuthProvider>.');
  }

  return context;
};

export default useAuth;
