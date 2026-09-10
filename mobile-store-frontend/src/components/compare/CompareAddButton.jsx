/**
 * Compare Add/Toggle Button Component
 * Module: components/compare/CompareAddButton.jsx
 * 
 * Interactive smartphone comparison toggle featuring:
 * - Reactive outline <-> filled transition with vibrant accent glow
 * - Tactile Framer Motion spring physics
 * - Unauthenticated login prompt modal ("Login to compare smartphones")
 * - 4-device maximum limit prevention
 * - Customizable sizing (sm, md, lg)
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftRight, LogIn, X, Sparkles, AlertCircle } from 'lucide-react';
import { useCompare } from '../../hooks/useCompare';
import { useUserAuth } from '../../hooks/useUserAuth';

const CompareAddButton = ({
  mobile,
  size = 'md',
  className = '',
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useUserAuth();
  const { isCompared, toggleCompare, count, maxLimit } = useCompare();

  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  if (!mobile || !mobile.id) return null;

  const compared = isCompared(mobile.id);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    toggleCompare(mobile.id, mobile);
  };

  const handleNavigateToLogin = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowLoginPrompt(false);
    navigate('/login', { state: { from: location } });
  };

  // Size styling maps
  const sizeMap = {
    sm: {
      btn: 'w-8 h-8 rounded-full p-1.5',
      icon: 'w-3.5 h-3.5',
    },
    md: {
      btn: 'w-9 h-9 rounded-xl p-2',
      icon: 'w-4 h-4',
    },
    lg: {
      btn: 'w-11 h-11 rounded-2xl p-2.5',
      icon: 'w-5 h-5',
    },
  }[size] || {
    btn: 'w-9 h-9 rounded-xl p-2',
    icon: 'w-4 h-4',
  };

  return (
    <>
      <motion.button
        type="button"
        onClick={handleClick}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.84 }}
        aria-label={compared ? `Remove ${mobile.name || 'item'} from compare` : `Add ${mobile.name || 'item'} to compare`}
        title={compared ? 'In comparison' : 'Compare smartphone'}
        className={`relative inline-flex items-center justify-center backdrop-blur-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 select-none z-10 ${
          compared
            ? 'bg-accent-500/20 border border-accent-500/50 text-accent-400 shadow-glow-sm shadow-accent-950/60'
            : 'bg-dark-900/80 hover:bg-dark-850 text-neutral-400 hover:text-white border border-dark-750/80'
        } ${sizeMap.btn} ${className}`}
      >
        <motion.div
          animate={compared ? { scale: [1, 1.25, 1], rotate: [0, 15, -15, 0] } : { scale: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <ArrowLeftRight
            className={`${sizeMap.icon} transition-colors ${
              compared ? 'text-accent-400 stroke-[2.5]' : 'text-neutral-400 group-hover:text-white'
            }`}
          />
        </motion.div>
      </motion.button>

      {/* Unauthenticated Login Prompt Modal */}
      <AnimatePresence>
        {showLoginPrompt && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="compare-login-title"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowLoginPrompt(false);
            }}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-dark-950/80 backdrop-blur-md"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 12 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm rounded-3xl bg-dark-900 border border-dark-750 p-6 shadow-2xl overflow-hidden text-center z-10"
            >
              {/* Radial Accent Glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-accent-600/10 rounded-full blur-2xl pointer-events-none" />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowLoginPrompt(false)}
                aria-label="Close dialog"
                className="absolute top-4 right-4 p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-dark-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Icon */}
              <div className="mx-auto w-12 h-12 rounded-2xl bg-accent-500/10 border border-accent-500/25 flex items-center justify-center text-accent-400 mb-4">
                <ArrowLeftRight className="w-6 h-6 text-accent-400 animate-pulse" />
              </div>

              {/* Title & Description */}
              <h3 id="compare-login-title" className="text-lg font-bold text-white tracking-tight">
                Compare Smartphones
              </h3>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                Sign in to compare up to 4 flagship smartphones side by side, analyze specifications, and sync your comparisons.
              </p>

              {/* Actions */}
              <div className="mt-6 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={handleNavigateToLogin}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-accent-600 hover:bg-accent-500 text-white text-xs font-bold shadow-glow-sm hover:shadow-glow-md transition-all duration-200"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In to Compare</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowLoginPrompt(false)}
                  className="w-full px-4 py-2.5 rounded-xl text-xs font-medium text-neutral-400 hover:text-white hover:bg-dark-800/80 transition-colors"
                >
                  Continue Browsing
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CompareAddButton;
