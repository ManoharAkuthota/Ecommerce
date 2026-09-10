/**
 * Premium Customer Dashboard Layout Component
 * Module: layouts/UserDashboardLayout.jsx
 * 
 * Reusable enterprise layout housing all customer account views (/account/**).
 * Features:
 * - Collapsible desktop sidebar with session storage memory (w-64 expanded <-> w-20 collapsed)
 * - Accessible mobile slide-in navigation drawer (<1024px)
 * - Sticky top header with dynamic page title, breadcrumb trail, user avatar, and logout
 * - Ambient obsidian dark theme styling with luxury glowing accents
 * - Dedicated subroute outlet for modular account pages
 */

import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import UserSidebar from '../components/account/UserSidebar';
import UserMobileSidebar from '../components/account/UserMobileSidebar';
import UserHeader from '../components/account/UserHeader';

const UserDashboardLayout = () => {
  // Session-persisted sidebar collapse state (Desktop)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return window.sessionStorage.getItem('user_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  // Mobile drawer open state (<1024px)
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const location = useLocation();
  const isChatPage = location.pathname.startsWith('/account/inquiries');

  // Ensure mobile drawer is closed on any route transition
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        window.sessionStorage.setItem('user_sidebar_collapsed', String(next));
      } catch {
        // Ignored in restricted environments
      }
      return next;
    });
  };

  return (
    <div
      className={`${
        isChatPage ? 'h-[100dvh] max-h-[100dvh] overflow-hidden' : 'min-h-screen'
      } bg-dark-950 text-neutral-100 flex flex-col relative`}
    >
      {/* Accessible Skip Link */}
      <a
        href="#user-main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent-600 focus:text-white focus:rounded-xl focus:shadow-lg focus:outline-none font-bold text-xs"
      >
        Skip to main content
      </a>

      {/* Background Ambient Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-1/4 w-[480px] h-[480px] bg-accent-600/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-1/3 w-[420px] h-[420px] bg-sky-600/5 rounded-full blur-[130px]" />
      </div>

      {/* 1. Desktop Fixed Sidebar */}
      <UserSidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* 2. Mobile Responsive Drawer */}
      <UserMobileSidebar
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
      />

      {/* 3. Main Content Container */}
      <div
        className={`flex-1 flex flex-col min-w-0 relative z-10 transition-all duration-300 ${
          isChatPage ? 'h-[100dvh] max-h-[100dvh] overflow-hidden' : ''
        } ${
          isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Dynamic Header */}
        <UserHeader onOpenMobileMenu={() => setIsMobileOpen(true)} />

        {/* Page Content Outlet - Unified document scroll on mobile to prevent touch freeze */}
        <main
          id="user-main-content"
          tabIndex="-1"
          className={`flex-1 min-h-0 ${
            isChatPage
              ? 'p-2 sm:p-3 lg:p-4 overflow-hidden flex flex-col'
              : 'p-4 sm:p-6 lg:p-8'
          } max-w-7xl w-full mx-auto focus:outline-none`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserDashboardLayout;
