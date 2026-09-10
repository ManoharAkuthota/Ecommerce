/**
 * Breadcrumb Component
 * Module: components/admin/Breadcrumb.jsx
 * 
 * Dynamically resolves the current administrative location into an accessible,
 * clickable breadcrumb navigation hierarchy.
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const ROUTE_LABELS = {
  admin: 'Admin',
  dashboard: 'Dashboard',
  mobiles: 'Mobile Devices',
  reviews: 'Customer Reviews',
  settings: 'Settings',
  analytics: 'Analytics',
};

const Breadcrumb = ({ className = '' }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Filter out leading 'admin' segment to form clean 'Dashboard / [Section]' trails
  const adminSegments = pathnames.filter((seg) => seg !== 'admin');

  // If directly at /admin or /admin/dashboard
  const isRootDashboard =
    adminSegments.length === 0 ||
    (adminSegments.length === 1 && adminSegments[0] === 'dashboard');

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
          to="/admin/dashboard"
          className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors"
        >
          <Home className="w-3.5 h-3.5 text-neutral-500" />
          <span>Dashboard</span>
        </Link>

        {!isRootDashboard &&
          adminSegments.map((segment, index) => {
            if (segment === 'dashboard') return null;

            const isLast = index === adminSegments.length - 1;
            const targetUrl = `/admin/${adminSegments.slice(0, index + 1).join('/')}`;
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

export default Breadcrumb;
