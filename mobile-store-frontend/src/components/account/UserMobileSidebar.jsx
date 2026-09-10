/**
 * Mobile Customer Navigation Drawer Component
 * Module: components/account/UserMobileSidebar.jsx
 * 
 * Accessible slide-in navigation drawer for tablet and mobile screens (<1024px).
 * Closes automatically on backdrop click, Escape key press, or route navigation.
 */

import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Smartphone,
  LayoutDashboard,
  User,
  Heart,
  Clock,
  Bell,
  Settings,
  ArrowLeft,
  Sparkles,
  Info,
} from 'lucide-react';
import { useUserAuth } from '../../hooks/useUserAuth';
import UserLogoutButton from './UserLogoutButton';
import { USER_NAV_ITEMS } from './UserSidebar';

const UserMobileSidebar = ({ isOpen, onClose }) => {
  const { user } = useUserAuth();
  const location = useLocation();

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock background body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Automatically close drawer when route changes
  useEffect(() => {
    onClose();
  }, [location.pathname]);

  const drawerVariants = {
    closed: {
      x: '-100%',
      transition: { type: 'spring', stiffness: 350, damping: 35 },
    },
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.05,
        delayChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, x: -16 },
    open: { opacity: 1, x: 0, transition: { duration: 0.2 } },
  };

  const displayName = user?.fullName || 'Customer';
  const displayEmail = user?.email || '';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 bg-dark-950/80 backdrop-blur-md"
          />

          {/* Slide-out Drawer Panel */}
          <motion.aside
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            role="dialog"
            aria-modal="true"
            aria-label="Customer Mobile Navigation Menu"
            className="relative z-10 w-4/5 max-w-xs h-full bg-dark-900 border-r border-dark-800 shadow-2xl flex flex-col justify-between p-5 overflow-y-auto"
          >
            {/* TOP: Header Branding & Close Button */}
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-dark-800/80">
                <Link
                  to="/account"
                  onClick={onClose}
                  className="flex items-center gap-3 overflow-hidden"
                >
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-accent-600 via-sky-500 to-indigo-500 flex items-center justify-center text-white shadow-glow-sm flex-shrink-0">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-black tracking-wider uppercase text-white font-sans">
                      MS <span className="text-accent-400 font-extrabold">Mobiles</span>
                    </span>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                      My Account
                    </span>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close mobile navigation menu"
                  className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-dark-800 border border-dark-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Customer Mini Profile Strip */}
              <div className="py-4 flex items-center gap-3 border-b border-dark-800/60">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent-600 to-sky-500 overflow-hidden flex items-center justify-center text-white text-sm font-extrabold shadow-glow-sm flex-shrink-0">
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={displayName}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    initial
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-white truncate">
                    {displayName}
                  </span>
                  <span className="text-[11px] text-neutral-400 truncate font-mono">
                    {displayEmail}
                  </span>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="mt-5 space-y-1.5" aria-label="Customer Mobile Links">
                <div className="px-2 pb-2 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                  Navigation
                </div>

                {USER_NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.exact
                    ? location.pathname === item.path
                    : location.pathname.startsWith(item.path);

                  return (
                    <motion.div key={item.path} variants={itemVariants}>
                      <Link
                        to={item.path}
                        onClick={onClose}
                        className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-accent-600/15 text-accent-400 border border-accent-500/30 shadow-glow-sm font-semibold'
                            : 'text-neutral-300 hover:text-white hover:bg-dark-800/60 border border-transparent'
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 flex-shrink-0 ${
                            isActive ? 'text-accent-400' : 'text-neutral-400'
                          }`}
                        />
                        <span className="truncate">{item.name}</span>
                        {item.badge && (
                          <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent-500/20 text-accent-300">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
            </div>

            {/* BOTTOM: Storefront Return & Logout Button */}
            <div className="pt-4 border-t border-dark-800/80 space-y-3">
              <div className="space-y-1.5">
                <Link
                  to="/"
                  onClick={onClose}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium text-neutral-400 hover:text-white hover:bg-dark-800/60 border border-dark-800 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 text-neutral-400" />
                  <span>Store Main Page</span>
                </Link>

                <Link
                  to="/about"
                  onClick={onClose}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium text-neutral-400 hover:text-white hover:bg-dark-800/60 border border-dark-800 transition-colors"
                >
                  <Info className="w-4 h-4 text-neutral-400" />
                  <span>About Store Details</span>
                </Link>
              </div>

              <UserLogoutButton
                variant="outline"
                size="sm"
                fullWidth
                label="Sign Out"
              />
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UserMobileSidebar;
