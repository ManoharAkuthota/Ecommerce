/**
 * Desktop Collapsible Admin Sidebar
 * Module: components/admin/Sidebar.jsx
 * 
 * Features:
 * - Desktop-fixed sidebar with smooth width collapse (w-64 expanded <-> w-20 collapsed)
 * - Session-remembered collapse state (sessionStorage)
 * - Active route styling with rounded accent highlight
 * - MS Mobiles branding with subtle entrance
 * - Extensible menu slots for future administrative modules
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Smartphone,
  MessageSquare,
  Inbox,
  Package,
  Users,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

const MENU_ITEMS = [
  {
    name: 'Dashboard',
    path: '/admin/dashboard',
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: 'Orders',
    path: '/admin/orders',
    icon: Package,
    badge: null,
  },
  {
    name: 'Customers',
    path: '/admin/users',
    icon: Users,
    badge: null,
  },
  {
    name: 'Mobiles',
    path: '/admin/mobiles',
    icon: Smartphone,
    badge: null,
  },
  {
    name: 'Reviews',
    path: '/admin/reviews',
    icon: MessageSquare,
    badge: null,
  },
  {
    name: 'Messages',
    path: '/admin/messages',
    icon: Inbox,
    badge: null,
  },
];

const Sidebar = ({ isCollapsed, onToggleCollapse }) => {
  const location = useLocation();

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
            to="/admin/dashboard"
            className="flex items-center gap-3 overflow-hidden group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-accent-600 to-indigo-500 flex items-center justify-center text-white shadow-glow-sm flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
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
                    Admin Panel
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1.5" aria-label="Admin Desktop Navigation">
          <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-widest text-neutral-500 overflow-hidden whitespace-nowrap">
            {!isCollapsed ? 'Navigation' : '•••'}
          </div>

          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                title={isCollapsed ? item.name : undefined}
                className={`relative flex items-center gap-3.5 px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 group ${
                  isActive
                    ? 'bg-accent-600/15 text-accent-300 border border-accent-500/30 shadow-glow-sm shadow-accent-950/40'
                    : 'text-neutral-400 hover:text-white hover:bg-dark-850/60 border border-transparent'
                }`}
              >
                <Icon
                  className={`w-4 h-4 flex-shrink-0 transition-colors ${
                    isActive ? 'text-accent-400' : 'text-neutral-500 group-hover:text-neutral-200'
                  }`}
                />

                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6 }}
                      transition={{ duration: 0.18 }}
                      className="whitespace-nowrap truncate flex-1"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>

                {!isCollapsed && item.badge && (
                  <span className="ml-auto text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-accent-500/10 text-accent-400 border border-accent-500/20">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* BOTTOM SECTION: Storefront Frontdoor & Collapse Toggle */}
      <div className="space-y-2 pt-4 border-t border-dark-800/80">
        {/* Customer Storefront Link */}
        <Link
          to="/"
          title={isCollapsed ? 'Customer Storefront' : undefined}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white hover:bg-dark-850 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 flex-shrink-0 text-accent-400 group-hover:-translate-x-0.5 transition-transform" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="whitespace-nowrap truncate text-xs"
              >
                Store Main Page
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        {/* Sidebar Collapse Toggle Button */}
        <button
          type="button"
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expand sidebar (Ctrl + B)' : 'Collapse sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="w-full flex items-center justify-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white hover:bg-dark-850 border border-dark-800/70 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-accent-400" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 text-neutral-400" />
              <span className="whitespace-nowrap text-[11px] font-semibold text-neutral-400">
                Collapse Sidebar
              </span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
