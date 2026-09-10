/**
 * Custom Customer Authentication Hook
 * Module: hooks/useUserAuth.js
 * 
 * Provides easy, type-safe access to UserAuthContext state and actions.
 * Throws an error if invoked outside the UserAuthProvider tree.
 */

import { useContext } from 'react';
import { UserAuthContext } from '../context/UserAuthContext';

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);

  if (!context) {
    throw new Error(
      'useUserAuth must be used within a UserAuthProvider. Ensure your component tree is wrapped with <UserAuthProvider>.'
    );
  }

  return context;
};

export default useUserAuth;
