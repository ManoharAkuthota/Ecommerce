/**
 * Top Navigation Notification Bell Component
 * Module: components/common/NotificationBell.jsx
 * 
 * Features:
 * - Prominent luxury Bell icon with active unread indicator dot & count badge.
 * - Pulse glow animation when unread alerts are available.
 * - Interactive glassmorphic dropdown preview showing recent notifications.
 * - Single-click "Mark as Read", item navigation, and full Notification Center link.
 * - Automatic outside-click & Escape dismiss handlers.
 * - Fully responsive: optimized for mobile touchscreens (<768px) and desktop.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Check,
  ArrowRight,
  ExternalLink,
  Sparkles,
  ShoppingBag,
  MessageSquare,
  Truck,
  ShieldCheck,
  Layers,
  X,
  LogIn,
} from 'lucide-react';
import { useNotificationBadge } from '../../hooks/useNotificationBadge';
import { useUserAuth } from '../../hooks/useUserAuth';

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return 'Recently';
  try {
    const time = new Date(dateStr).getTime();
    if (Number.isNaN(time)) return 'Recently';
    const diffSec = Math.floor((Date.now() - time) / 1000);

    if (diffSec < 60) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    if (diffSec < 172800) return 'Yesterday';

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(new Date(time));
  } catch {
    return 'Recently';
  }
};

export const NotificationBell = ({ isScrolled = false, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated } = useUserAuth();

  // Close dropdown on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);
  const {
    unreadCount,
    hasUnread,
    recentNotifications,
    readIds,
    markAsRead,
    markAllAsRead,
    isLoading,
  } = useNotificationBadge();

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick, { passive: true });
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleItemClick = (item) => {
    markAsRead(item.id);
    setIsOpen(false);
    if (item.link) {
      navigate(item.link);
    } else {
      navigate('/account/notifications');
    }
  };

  const handleViewAll = () => {
    setIsOpen(false);
    if (isAuthenticated) {
      navigate('/account/notifications');
    } else {
      navigate('/login?redirect=/account/notifications');
    }
  };

  return (
    <div className={`relative inline-flex items-center ${className}`} ref={dropdownRef}>
      {/* BELL TRIGGER BUTTON */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={hasUnread ? `Notifications (${unreadCount} unread)` : 'Notifications'}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={hasUnread ? `Notifications: ${unreadCount} new` : 'Notifications & Alerts'}
        className={`relative p-2 sm:p-2.5 rounded-full sm:rounded-xl border transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 ${
          isOpen
            ? 'bg-accent-600/20 text-accent-300 border-accent-500/50 shadow-glow-sm'
            : isScrolled
            ? 'text-neutral-700 hover:text-accent-600 hover:bg-neutral-100/80 border-neutral-200/80'
            : 'text-neutral-300 hover:text-white hover:bg-dark-850/80 border-dark-800/80'
        }`}
      >
        <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5" />

        {/* ACTIVE UNREAD INDICATOR: Pulsing dot + count badge */}
        {hasUnread && (
          <>
            {/* Ambient outer pulse ping */}
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-accent-400 opacity-75 animate-ping pointer-events-none" />

            {/* Glowing badge */}
            <motion.span
              key={unreadCount}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-accent-500 text-white text-[10px] font-black flex items-center justify-center shadow-glow-sm pointer-events-none"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          </>
        )}
      </motion.button>

      {/* LUXURY NOTIFICATIONS DROPDOWN POPOVER */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed sm:absolute right-2 sm:right-0 top-16 sm:top-full mt-2 w-[calc(100vw-1rem)] sm:w-96 max-w-sm z-50 bg-dark-950/95 backdrop-blur-2xl border border-dark-750/90 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden select-none"
          >
            {/* Header: Title + Unread pill + Mark all read */}
            <div className="px-4 py-3.5 border-b border-dark-800/80 flex items-center justify-between bg-dark-900/60">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-accent-500/15 text-accent-400">
                  <Bell className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                  Notifications
                </h3>
                {hasUnread && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-accent-500/20 text-accent-300 border border-accent-500/30">
                    {unreadCount} New
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                {hasUnread && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      markAllAsRead();
                    }}
                    className="text-[11px] font-semibold text-accent-400 hover:text-accent-300 px-2 py-1 rounded-lg hover:bg-dark-800 transition-colors flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    <span>Mark all read</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close notifications panel"
                  className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-dark-800 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Notification items list */}
            <div className="max-h-[340px] overflow-y-auto divide-y divide-dark-800/50 overscroll-contain">
              {!isAuthenticated ? (
                /* Unauthenticated customer prompt */
                <div className="p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center text-accent-400 mx-auto">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs sm:text-sm font-bold text-white">
                      Stay Informed on Flagship Drops
                    </h4>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      Sign in to track real-time courier fulfillment, receive concierge chat replies, and unlock member perks.
                    </p>
                  </div>
                  <Link
                    to="/login?redirect=/account/notifications"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-accent-600 hover:bg-accent-500 text-white text-xs font-bold transition-all shadow-glow-sm"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Customer Sign In</span>
                  </Link>
                </div>
              ) : recentNotifications.length === 0 ? (
                /* Empty caught up state */
                <div className="p-8 text-center space-y-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
                    <Check className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    You're All Caught Up
                  </h4>
                  <p className="text-[11px] text-neutral-400 max-w-xs mx-auto">
                    No active notifications. We will alert you whenever orders update or concierge messages arrive.
                  </p>
                </div>
              ) : (
                /* Recent notifications list */
                recentNotifications.map((item) => {
                  const isRead = readIds.includes(item.id);
                  const Icon = item.icon || Bell;

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      className={`p-3.5 sm:p-4 flex items-start gap-3 cursor-pointer transition-colors relative ${
                        isRead
                          ? 'bg-transparent hover:bg-dark-900/60 opacity-80 hover:opacity-100'
                          : 'bg-dark-900/70 hover:bg-dark-900 border-l-2 border-accent-400'
                      }`}
                    >
                      {/* Left icon badge */}
                      <div className={`p-2 rounded-xl border shrink-0 ${
                        isRead
                          ? 'bg-dark-900 border-dark-800 text-neutral-400'
                          : 'bg-accent-600/15 border-accent-500/30 text-accent-400 shadow-sm'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <h5 className={`text-xs font-bold truncate ${
                            isRead ? 'text-neutral-300' : 'text-white'
                          }`}>
                            {item.title}
                          </h5>
                          <span className="text-[10px] text-neutral-500 shrink-0 font-mono">
                            {formatTimeAgo(item.timestamp)}
                          </span>
                        </div>

                        <p className="text-[11px] text-neutral-400 leading-snug line-clamp-2">
                          {item.message}
                        </p>

                        {/* Stage or badge tag */}
                        {item.badgeLabel && (
                          <div className="pt-0.5">
                            <span className={`inline-block px-1.5 py-0.2 rounded-full text-[9px] font-bold border ${
                              item.badgeClass || 'bg-dark-800 text-neutral-300 border-dark-700'
                            }`}>
                              {item.badgeLabel}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Unread indicator dot */}
                      {!isRead && (
                        <div className="pt-1 shrink-0">
                          <span className="w-2 h-2 rounded-full bg-accent-400 shadow-glow-sm block" />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer: Link to full Notification Center */}
            <div className="p-2.5 bg-dark-950 border-t border-dark-800/80">
              <button
                type="button"
                onClick={handleViewAll}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-accent-400 hover:text-accent-300 hover:bg-dark-900 transition-colors"
              >
                <span>Open Notification Center</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
