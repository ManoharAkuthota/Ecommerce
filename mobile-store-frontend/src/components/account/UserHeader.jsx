/**
 * Customer Dashboard Header Component
 * Module: components/account/UserHeader.jsx
 * 
 * Sticky top bar featuring:
 * - Mobile drawer hamburger trigger
 * - Dynamic page title & integrated UserBreadcrumb trail
 * - Live storefront external link
 * - Customer identity badge (initial avatar, customer name, role)
 * - Standardized UserLogoutButton action
 */

import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, ExternalLink, User, ShieldCheck } from 'lucide-react';
import { useUserAuth } from '../../hooks/useUserAuth';
import UserBreadcrumb from './UserBreadcrumb';
import UserLogoutButton from './UserLogoutButton';
import NotificationBell from '../common/NotificationBell';

const ACCOUNT_TITLES = {
  account: 'Account Dashboard',
  profile: 'Personal Profile',
  orders: 'My Orders',
  wishlist: 'Saved Wishlist',
  inquiries: 'Customer Inquiries & Support',
  recent: 'Recently Viewed',
  notifications: 'Notifications & Alerts',
  settings: 'Account Settings',
};

const UserHeader = ({ onOpenMobileMenu }) => {
  const { user } = useUserAuth();
  const location = useLocation();

  // Determine current active subroute title
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const currentSubroute = pathSegments[1] || 'account';
  const pageTitle = ACCOUNT_TITLES[currentSubroute] || 'My Account';

  const displayName = user?.fullName || 'Customer';
  const firstName = displayName.split(' ')[0] || displayName;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-xl bg-dark-950/85 border-b border-dark-800/80 transition-all duration-200 select-none">
      <div className="px-3 sm:px-6 lg:px-8 h-15 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* LEFT: Mobile Menu Button + Title + Breadcrumb */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 sm:flex-initial">
          {/* Mobile Drawer Trigger (Hidden on Desktop >= 1024px) */}
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="Open mobile account menu"
            className="lg:hidden p-2 rounded-xl text-neutral-300 hover:text-white bg-dark-900/80 hover:bg-dark-850 border border-dark-750/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 transition-all active:scale-95 shadow-sm flex-shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Title & Breadcrumb Hierarchy */}
          <div className="flex flex-col min-w-0">
            <h1 className="text-sm sm:text-base font-extrabold text-white tracking-tight truncate font-sans">
              {pageTitle}
            </h1>
            <UserBreadcrumb className="hidden sm:flex mt-0.5" />
          </div>
        </div>

        {/* RIGHT: Storefront Link, Customer Identity & Logout */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          {/* Store Main Page Link (Desktop only) */}
          <Link
            to="/"
            title="View Store Main Page"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-neutral-400 hover:text-white hover:bg-dark-900 border border-dark-800 transition-colors"
          >
            <span>Store Main Page</span>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
          </Link>

          {/* Customer Notification Bell (Visible on Mobile & Desktop) */}
          <NotificationBell />

          {/* Customer Identity Card (Visible on Mobile & Desktop) */}
          <Link
            to="/account/profile"
            title="View Profile"
            className="flex items-center gap-1.5 sm:gap-2 pl-2 sm:pl-3 border-l border-dark-800/80 hover:opacity-90 transition-opacity"
          >
            {/* Avatar Badge */}
            <div className="w-8 h-8 rounded-full ring-2 ring-cyan-500/30 bg-gradient-to-tr from-cyan-500 via-sky-500 to-indigo-600 overflow-hidden flex items-center justify-center text-white text-xs font-black shadow-glow-sm flex-shrink-0">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={displayName}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                initial || <User className="w-4 h-4" />
              )}
            </div>

            {/* Customer Details (Always visible on mobile & desktop) */}
            <div className="flex flex-col text-left min-w-0">
              <div className="flex items-center gap-1 min-w-0">
                <span className="text-xs font-extrabold text-white leading-tight truncate max-w-[70px] sm:hidden tracking-tight">
                  {firstName}
                </span>
                <span className="hidden sm:inline text-xs font-extrabold text-white leading-tight truncate max-w-[140px] tracking-tight">
                  {displayName}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" title="Active" />
              </div>
              <span className="hidden sm:flex text-[10px] font-bold text-cyan-400 uppercase tracking-wider items-center gap-1">
                <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                Customer
              </span>
            </div>
          </Link>

          {/* Logout Action */}
          <UserLogoutButton
            variant="ghost"
            size="sm"
            label="Sign Out"
            className="hidden sm:inline-flex"
          />
        </div>
      </div>
    </header>
  );
};

export default UserHeader;
