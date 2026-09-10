/**
 * Customer Protected Route Guard
 * Module: routes/UserProtectedRoute.jsx
 * 
 * Guards customer account routes (/account/**) from unauthenticated access.
 * Displays a luxury session restoration screen during JWT verification to prevent flicker,
 * and seamlessly preserves target location across redirect chains back to /login.
 */

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, UserCheck } from 'lucide-react';
import { useUserAuth } from '../hooks/useUserAuth';
import Spinner from '../components/ui/Spinner';

export const UserProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useUserAuth();
  const location = useLocation();

  // 1. Session Restoration Loading Screen (Anti-flicker guard)
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="min-h-screen flex flex-col items-center justify-center bg-dark-950 text-neutral-200 px-4 select-none"
      >
        <div className="relative flex flex-col items-center gap-5">
          {/* Ambient Glowing Halo */}
          <div className="absolute -inset-6 bg-accent-600/15 rounded-full blur-2xl pointer-events-none" />

          {/* Luxury Customer Icon Badge */}
          <div className="relative p-4 rounded-3xl bg-dark-900/90 border border-dark-800 shadow-glow-sm text-accent-400">
            <UserCheck className="w-8 h-8 animate-pulse text-accent-400" />
            <Sparkles className="w-3.5 h-3.5 text-amber-400 absolute top-2 right-2 animate-bounce" />
          </div>

          {/* Spinner and Status Label */}
          <div className="flex flex-col items-center gap-2.5 text-center">
            <Spinner size="md" color="accent" />
            <span className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
              Verifying Customer Session...
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  // 2. Unauthenticated Redirect: Forward to customer login with preserved return path
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Authenticated: Render children or nested route outlet
  return children ? children : <Outlet />;
};

export default UserProtectedRoute;
