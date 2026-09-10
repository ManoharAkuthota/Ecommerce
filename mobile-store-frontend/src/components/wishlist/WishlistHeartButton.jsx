/**
 * Wishlist Heart Button Component
 * Module: components/wishlist/WishlistHeartButton.jsx
 * 
 * Interactive heart bookmark action featuring:
 * - Reactive outline <-> filled transition with vibrant rose accent
 * - Framer Motion tactile spring pop and bounce physics
 * - Unauthenticated login prompt modal ("Login to save your favorite mobiles")
 * - Customizable sizing (sm, md, lg) for card thumbnails and product headers
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, LogIn, X, Sparkles } from 'lucide-react';
import { useWishlist } from '../../hooks/useWishlist';
import { useUserAuth } from '../../hooks/useUserAuth';

const WishlistHeartButton = ({
  mobile,
  size = 'md',
  className = '',
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useUserAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  if (!mobile || !mobile.id) return null;

  const saved = isWishlisted(mobile.id);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    toggleWishlist(mobile.id, mobile);
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
      icon: 'w-4 h-4',
    },
    md: {
      btn: 'w-9 h-9 rounded-xl p-2',
      icon: 'w-5 h-5',
    },
    lg: {
      btn: 'w-11 h-11 rounded-2xl p-2.5',
      icon: 'w-6 h-6',
    },
  }[size] || {
    btn: 'w-9 h-9 rounded-xl p-2',
    icon: 'w-5 h-5',
  };

  return (
    <>
      <motion.button
        type="button"
        onClick={handleClick}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.82 }}
        aria-label={saved ? `Remove ${mobile.name || 'item'} from wishlist` : `Add ${mobile.name || 'item'} to wishlist`}
        className={`relative inline-flex items-center justify-center backdrop-blur-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 select-none z-10 ${
          saved
            ? 'bg-rose-500/15 border border-rose-500/30 text-rose-500 shadow-glow-sm shadow-rose-950/50'
            : 'bg-dark-900/80 hover:bg-dark-850 text-neutral-400 hover:text-white border border-dark-750/80'
        } ${sizeMap.btn} ${className}`}
      >
        <motion.div
          animate={saved ? { scale: [1, 1.28, 1] } : { scale: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <Heart
            className={`${sizeMap.icon} transition-colors ${
              saved ? 'fill-rose-500 text-rose-500' : 'text-neutral-400 group-hover:text-white'
            }`}
          />
        </motion.div>
      </motion.button>

      {/* Unauthenticated Login Prompt Modal */}
      <AnimatePresence>
        {showLoginPrompt && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              e.stopPropagation();
              setShowLoginPrompt(false);
            }}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-dark-950/80 backdrop-blur-md"
            />

            {/* Dialog Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 16 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="wishlist-login-prompt-title"
              className="relative z-10 w-full max-w-sm rounded-3xl bg-gradient-to-b from-dark-900 via-dark-900 to-dark-950 border border-dark-750 p-6 sm:p-7 shadow-2xl space-y-5 text-center"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowLoginPrompt(false)}
                aria-label="Close dialog"
                className="absolute top-4 right-4 p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-dark-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Heart Badge */}
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto shadow-glow-sm">
                <Heart className="w-7 h-7 fill-rose-500/30" />
              </div>

              <div className="space-y-2">
                <h3
                  id="wishlist-login-prompt-title"
                  className="text-lg font-bold text-white tracking-tight"
                >
                  Save to Your Wishlist
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  Login to save your favorite mobiles and access your wishlist across all devices.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleNavigateToLogin}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-accent-600 hover:bg-accent-500 text-white shadow-glow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowLoginPrompt(false)}
                  className="w-full px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white hover:bg-dark-850 border border-dark-750 transition-colors"
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

export default WishlistHeartButton;
