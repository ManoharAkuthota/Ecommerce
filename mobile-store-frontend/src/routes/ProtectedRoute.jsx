/**
 * Enterprise Protected Route Guard
 * Module: routes/ProtectedRoute.jsx
 * 
 * Guards administrative routes from unauthenticated access.
 * Displays a premium loading screen during session restoration to prevent route flicker,
 * and seamlessly preserves target location across redirect chains.
 */

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/ui/Spinner';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // 1. Session Restoration Loading Screen (Prevents route flicker)
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
          {/* Subtle glowing ambient halo */}
          <div className="absolute -inset-4 bg-accent-600/10 rounded-full blur-2xl pointer-events-none" />

          {/* Shield Badge */}
          <div className="relative p-3.5 rounded-2xl bg-dark-900/90 border border-dark-800 shadow-glow-sm text-accent-400">
            <ShieldCheck className="w-8 h-8 animate-pulse" />
          </div>

          {/* Spinner and Label */}
          <div className="flex flex-col items-center gap-2 text-center">
            <Spinner size="md" color="accent" />
            <span className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
              Verifying Security Session...
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  // 2. Unauthenticated Redirect: Forward to login while preserving destination
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // 3. Authenticated: Render children or nested route outlet
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
