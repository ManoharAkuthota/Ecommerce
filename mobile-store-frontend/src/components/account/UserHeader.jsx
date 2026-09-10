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
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-xl bg-dark-950/85 border-b border-dark-800/80 transition-all duration-200 select-none">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* LEFT: Mobile Menu Button + Title + Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile Drawer Trigger (Hidden on Desktop >= 1024px) */}
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="Open mobile account menu"
            className="lg:hidden p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-dark-900 border border-dark-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Title & Breadcrumb Hierarchy */}
          <div className="flex flex-col min-w-0">
            <h1 className="text-sm sm:text-base font-bold text-white tracking-tight truncate font-sans">
              {pageTitle}
            </h1>
            <UserBreadcrumb className="hidden sm:flex mt-0.5" />
          </div>
        </div>

        {/* RIGHT: Storefront Link, Customer Identity & Logout */}
        <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
          {/* Store Main Page Link (Desktop only) */}
          <Link
            to="/"
            title="View Store Main Page"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-neutral-400 hover:text-white hover:bg-dark-900 border border-dark-800 transition-colors"
          >
            <span>Store Main Page</span>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
          </Link>

          {/* Customer Identity Card */}
          <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-dark-800/80">
            {/* Avatar Badge */}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-accent-600 via-sky-500 to-indigo-500 overflow-hidden flex items-center justify-center text-white text-xs font-extrabold shadow-glow-sm flex-shrink-0">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={displayName}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                initial || <User className="w-4 h-4" />
              )}
            </div>

            {/* Customer Details (Hidden on small mobile) */}
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-white leading-tight truncate max-w-[130px]">
                {displayName}
              </span>
              <span className="text-[10px] font-semibold text-accent-400 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                Customer
              </span>
            </div>
          </div>

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
