/**
 * Customer Breadcrumb Navigation Component
 * Module: components/account/UserBreadcrumb.jsx
 * 
 * Dynamically resolves customer dashboard routes into a clear, accessible,
 * clickable breadcrumb navigation trail.
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const ROUTE_LABELS = {
  account: 'Account',
  profile: 'Profile',
  orders: 'Orders',
  wishlist: 'Wishlist',
  inquiries: 'Inquiries',
  recent: 'Recently Viewed',
  notifications: 'Notifications',
  settings: 'Settings',
};

const UserBreadcrumb = ({ className = '' }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(Boolean);

  // Filter out leading 'account' segment to form clean 'Account / [Section]' trails
  const accountSegments = pathnames.filter((seg) => seg !== 'account');
  const isRootAccount = accountSegments.length === 0;

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-1.5 text-xs select-none ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, x: -4 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-center gap-1.5"
      >
        <Link
          to="/account"
          className={`inline-flex items-center gap-1.5 transition-colors ${
            isRootAccount
              ? 'font-semibold text-accent-300 pointer-events-none'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Home className="w-3.5 h-3.5 text-neutral-500" />
          <span>Account</span>
        </Link>

        {!isRootAccount &&
          accountSegments.map((segment, index) => {
            const isLast = index === accountSegments.length - 1;
            const targetUrl = `/account/${accountSegments.slice(0, index + 1).join('/')}`;
            const label = ROUTE_LABELS[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

            return (
              <React.Fragment key={targetUrl}>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-600 flex-shrink-0" />
                {isLast ? (
                  <span
                    aria-current="page"
                    className="font-semibold text-accent-300 tracking-wide"
                  >
                    {label}
                  </span>
                ) : (
                  <Link
                    to={targetUrl}
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
      </motion.div>
    </nav>
  );
};

export default UserBreadcrumb;
