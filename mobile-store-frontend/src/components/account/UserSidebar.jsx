/**
 * Desktop Collapsible Customer Sidebar
 * Module: components/account/UserSidebar.jsx
 * 
 * Features:
 * - Desktop-fixed sidebar with smooth width collapse (w-64 expanded <-> w-20 collapsed)
 * - Session-remembered collapse state (sessionStorage: user_sidebar_collapsed)
 * - Active route highlight with rounded accent background and subtle glow
 * - MS Mobiles branding with "My Account" subtitle
 * - Reusable navigation for all customer portal modules
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationBadge } from '../../hooks/useNotificationBadge';
import {
  LayoutDashboard,
  User,
  Heart,
  Clock,
  Bell,
  Settings,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Smartphone,
  Package,
  Info,
  Store,
} from 'lucide-react';

export const USER_NAV_ITEMS = [
  {
    name: 'Dashboard',
    path: '/account',
    exact: true,
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: 'My Orders',
    path: '/account/orders',
    exact: false,
    icon: Package,
    badge: null,
  },
  {
    name: 'Profile',
    path: '/account/profile',
    exact: false,
    icon: User,
    badge: null,
  },
  {
    name: 'Wishlist',
    path: '/account/wishlist',
    exact: false,
    icon: Heart,
    badge: null,
  },
  {
    name: 'Live Chat & Support',
    path: '/account/inquiries',
    exact: false,
    icon: MessageSquare,
    badge: null,
  },
  {
    name: 'Recently Viewed',
    path: '/account/recent',
    exact: false,
    icon: Clock,
    badge: null,
  },
  {
    name: 'Notifications',
    path: '/account/notifications',
    exact: false,
    icon: Bell,
    badge: null,
  },
  {
    name: 'Settings',
    path: '/account/settings',
    exact: false,
    icon: Settings,
    badge: null,
  },
];

const UserSidebar = ({ isCollapsed, onToggleCollapse }) => {
  const location = useLocation();
  const { unreadCount } = useNotificationBadge();

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="hidden lg:flex flex-col justify-between fixed top-0 left-0 bottom-0 z-40 bg-dark-900/65 backdrop-blur-2xl border-r border-dark-800/80 p-4 select-none overflow-x-hidden"
    >
      {/* TOP SECTION: Branding & Navigation */}
      <div className="space-y-7">
        {/* Branding Header */}
        <div className="flex items-center justify-between h-12 px-2">
          <Link
            to="/account"
            className="flex items-center gap-3 overflow-hidden group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-accent-600 via-sky-500 to-indigo-500 flex items-center justify-center text-white shadow-glow-sm flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
              <Smartphone className="w-5 h-5" />
            </div>

            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col whitespace-nowrap overflow-hidden"
                >
                  <span className="text-sm font-black tracking-wider uppercase text-white font-sans">
                    MS <span className="text-accent-400 font-extrabold">Mobiles</span>
                  </span>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                    My Account
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1.5" aria-label="Customer Desktop Navigation">
          <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-widest text-neutral-500 overflow-hidden whitespace-nowrap">
            {!isCollapsed ? 'Customer Portal' : '•••'}
          </div>

          {USER_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);

            const itemBadge =
              item.path === '/account/notifications' && unreadCount > 0
                ? `${unreadCount} new`
                : item.badge;

            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative block group"
              >
                <div
                  className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden ${
                    isActive
                      ? 'bg-accent-600/15 text-accent-400 border border-accent-500/30 shadow-glow-sm'
                      : 'text-neutral-400 hover:text-white hover:bg-dark-800/60 border border-transparent'
                  }`}
                >
                  {/* Left Active Glow Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeUserNavPill"
                      className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-accent-500 rounded-r-full shadow-glow-sm"
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    />
                  )}

                  <Icon
                    className={`w-5 h-5 flex-shrink-0 transition-colors ${
                      isActive ? 'text-accent-400' : 'text-neutral-400 group-hover:text-white'
                    }`}
                  />

                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -6 }}
                        transition={{ duration: 0.15 }}
                        className="truncate font-medium tracking-tight"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Badge support */}
                  {itemBadge && !isCollapsed && (
                    <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-accent-500/20 text-accent-300">
                      {itemBadge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* BOTTOM SECTION: Store Navigation & Collapse Toggle */}
      <div className="space-y-1.5 pt-4 border-t border-dark-800/80">
        {/* Back to Store Main Page Link */}
        <Link
          to="/"
          title="Back to Store Main Page"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white hover:bg-dark-800/50 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 text-neutral-400 group-hover:text-accent-400 transition-colors flex-shrink-0" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.15 }}
                className="truncate"
              >
                Store Main Page
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        {/* About Us & Store Details Link */}
        <Link
          to="/about"
          title="About Us & Store Details"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white hover:bg-dark-800/50 transition-colors group"
        >
          <Info className="w-4 h-4 text-neutral-400 group-hover:text-accent-400 transition-colors flex-shrink-0" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.15 }}
                className="truncate"
              >
                About Store Details
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        {/* Sidebar Collapse Toggle Button */}
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white hover:bg-dark-800/60 border border-dark-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 transition-all"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 text-neutral-400" />
              <span className="truncate">Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
};

export default UserSidebar;
