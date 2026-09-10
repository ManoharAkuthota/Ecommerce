/**
 * Admin Dashboard Header Component
 * Module: components/admin/Header.jsx
 * 
 * Sticky top bar featuring:
 * - Mobile hamburger trigger
 * - Dynamic page title & integrated Breadcrumb navigation
 * - Administrator identity badge (avatar, name, role)
 * - Customer storefront link & quick LogoutButton action
 */

import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, ExternalLink, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Breadcrumb from './Breadcrumb';
import LogoutButton from './LogoutButton';

const TITLES = {
  dashboard: 'Dashboard Overview',
  mobiles: 'Mobile Device Catalog',
  reviews: 'Customer Reviews & Moderation',
};

const Header = ({ onOpenMobileMenu }) => {
  const { admin } = useAuth();
  const location = useLocation();

  // Determine current active page title
  const currentSegment = location.pathname.split('/').filter(Boolean)[1] || 'dashboard';
  const pageTitle = TITLES[currentSegment] || 'Admin Console';

  // Compute initials for avatar badge
  const adminName = admin?.name || 'Administrator';
  const initials = adminName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-xl bg-dark-950/85 border-b border-dark-800/80 transition-all duration-200 select-none">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* LEFT: Mobile Menu Button + Title + Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile Drawer Trigger (Hidden on Desktop >= 1024px) */}
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="Open mobile navigation menu"
            className="lg:hidden p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-dark-900 border border-dark-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Title & Breadcrumb Hierarchy */}
          <div className="flex flex-col min-w-0">
            <h1 className="text-sm sm:text-base font-bold text-white tracking-tight truncate font-sans">
              {pageTitle}
            </h1>
            <Breadcrumb className="hidden sm:flex mt-0.5" />
          </div>
        </div>

        {/* RIGHT: Storefront Frontdoor Link, Admin Identity & Logout */}
        <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
          {/* Customer Storefront Link */}
          <Link
            to="/"
            title="Return to Store Main Page"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white hover:bg-dark-900 border border-dark-800 transition-colors"
          >
            <span>Store Main Page</span>
            <ExternalLink className="w-3.5 h-3.5 text-accent-400" />
          </Link>

          {/* Admin Identity Card */}
          <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-dark-800/80">
            {/* Avatar Badge */}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-accent-600 to-indigo-500 flex items-center justify-center text-white text-xs font-extrabold shadow-glow-sm flex-shrink-0">
              {initials || <User className="w-4 h-4" />}
            </div>

            {/* Admin Details (Always visible on mobile & desktop) */}
            <div className="flex flex-col text-left min-w-0">
              <span className="text-xs font-bold text-white leading-tight truncate max-w-[85px] xs:max-w-[110px] sm:max-w-[140px]">
                {adminName}
              </span>
              <span className="hidden sm:flex text-[10px] font-semibold text-accent-400 uppercase tracking-wider items-center gap-1">
                <ShieldCheck className="w-2.5 h-2.5" />
                Super Admin
              </span>
            </div>
          </div>

          {/* Logout Action */}
          <LogoutButton
            variant="ghost"
            size="sm"
            iconOnly={true}
            className="sm:!hidden p-2 rounded-xl border border-dark-800"
          />
          <LogoutButton
            variant="ghost"
            size="sm"
            showLabel={true}
            className="hidden sm:inline-flex border border-dark-800/80 hover:border-rose-500/40"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
