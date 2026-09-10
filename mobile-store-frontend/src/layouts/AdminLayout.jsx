/**
 * Premium Admin Layout Component
 * Module: layouts/AdminLayout.jsx
 * 
 * Reusable enterprise layout housing all administrative views (/admin/**).
 * Features:
 * - Collapsible desktop sidebar with session storage memory (w-64 expanded <-> w-20 collapsed)
 * - Accessible mobile slide-in navigation drawer
 * - Sticky top header with dynamic page title, breadcrumb trail, and admin profile
 * - Ambient obsidian dark theme styling with subtle glowing accents
 */

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../components/admin/Sidebar';
import MobileSidebar from '../components/admin/MobileSidebar';
import Header from '../components/admin/Header';

const AdminLayout = () => {
  // Session-persisted sidebar collapse state (Desktop)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return window.sessionStorage.getItem('admin_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  // Mobile drawer open state (<1024px)
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        window.sessionStorage.setItem('admin_sidebar_collapsed', String(next));
      } catch {
        // Ignored in private/restricted environments
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-dark-950 text-neutral-100 flex flex-col relative">
      {/* Accessible Skip Link */}
      <a
        href="#admin-main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent-600 focus:text-white focus:rounded-xl focus:shadow-lg focus:outline-none font-bold text-xs"
      >
        Skip to main content
      </a>

      {/* Background Ambient Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-1/4 w-[480px] h-[480px] bg-accent-600/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-1/3 w-[420px] h-[420px] bg-purple-600/5 rounded-full blur-[130px]" />
      </div>

      {/* 1. Desktop Fixed Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* 2. Mobile Responsive Drawer */}
      <MobileSidebar
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
      />

      {/* 3. Main Content Container */}
      <div
        className={`flex-1 flex flex-col min-w-0 relative z-10 transition-all duration-300 ${
          isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Dynamic Header */}
        <Header onOpenMobileMenu={() => setIsMobileOpen(true)} />

        {/* Page Content Outlet - Unified document scroll on mobile to prevent touch freeze */}
        <main id="admin-main-content" tabIndex="-1" className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto focus:outline-none">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
