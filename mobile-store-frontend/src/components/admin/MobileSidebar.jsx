/**
 * Mobile Admin Drawer Component
 * Module: components/admin/MobileSidebar.jsx
 * 
 * Accessible slide-in navigation drawer for tablet and mobile screens (<1024px).
 * Closes automatically on outside click, Escape key, or route navigation.
 */

import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Smartphone,
  LayoutDashboard,
  MessageSquare,
  Package,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import LogoutButton from './LogoutButton';

const MENU_ITEMS = [
  {
    name: 'Dashboard',
    path: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Orders',
    path: '/admin/orders',
    icon: Package,
  },
  {
    name: 'Mobile Devices',
    path: '/admin/mobiles',
    icon: Smartphone,
  },
  {
    name: 'Customer Reviews',
    path: '/admin/reviews',
    icon: MessageSquare,
  },
];

const MobileSidebar = ({ isOpen, onClose }) => {
  const { admin } = useAuth();
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

  // Lock background scroll when drawer is open
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />

          {/* Slide-in Drawer Container */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="relative w-full max-w-[300px] h-full bg-dark-950/95 border-r border-dark-800/80 shadow-2xl backdrop-blur-2xl flex flex-col justify-between p-6 z-10 overflow-y-auto select-none"
          >
            {/* TOP: Header Branding & Close Button */}
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-dark-800/80">
                <Link
                  to="/admin/dashboard"
                  onClick={onClose}
                  className="flex items-center gap-2.5"
                >
                  <div className="p-2 rounded-xl bg-gradient-to-tr from-accent-600 to-indigo-500 text-white shadow-glow-sm">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-black tracking-wider uppercase text-white font-sans">
                      MS <span className="text-accent-400 font-extrabold">Mobiles</span>
                    </span>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                      Admin Panel
                    </span>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close navigation drawer"
                  className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-dark-900 border border-dark-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="mt-6 space-y-1.5" aria-label="Mobile Drawer Navigation">
                <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                  Navigation
                </div>

                {MENU_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname.startsWith(item.path);

                  return (
                    <motion.div key={item.path} variants={itemVariants}>
                      <Link
                        to={item.path}
                        onClick={onClose}
                        className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-semibold tracking-wide transition-all duration-200 ${
                          isActive
                            ? 'bg-accent-600/15 text-accent-300 border border-accent-500/30 shadow-glow-sm shadow-accent-950/40'
                            : 'text-neutral-400 hover:text-white hover:bg-dark-900 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            className={`w-4 h-4 ${
                              isActive ? 'text-accent-400' : 'text-neutral-500'
                            }`}
                          />
                          <span>{item.name}</span>
                        </div>

                        {item.badge && (
                          <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-accent-500/10 text-accent-400 border border-accent-500/20">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
            </div>

            {/* BOTTOM: Admin Card, Storefront Link, and Logout */}
            <motion.div
              variants={itemVariants}
              className="pt-6 border-t border-dark-800/80 space-y-3"
            >
              {/* Admin profile pill */}
              <div className="p-3 rounded-2xl bg-dark-900/80 border border-dark-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-accent-600 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow-glow-sm flex-shrink-0">
                  {admin?.name?.charAt(0) || 'A'}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-white truncate">
                    {admin?.name || 'Administrator'}
                  </span>
                  <span className="text-[10px] text-neutral-400 truncate">
                    {admin?.email || 'admin@ms.com'}
                  </span>
                </div>
              </div>

              {/* Link to Storefront */}
              <Link
                to="/"
                onClick={onClose}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium text-neutral-400 hover:text-white hover:bg-dark-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-neutral-500" />
                <span>Store Main Page</span>
              </Link>

              {/* Logout Button */}
              <LogoutButton
                variant="outline"
                size="md"
                fullWidth={true}
                label="Sign Out of Console"
              />
            </motion.div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;
