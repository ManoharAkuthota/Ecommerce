/**
 * Shared Customer Authentication Layout
 * Module: components/auth/AuthLayout.jsx
 * 
 * Reusable split-screen layout for /login and /register:
 * - Left panel (lg+): AuthIllustration with hardware cards & trust badges
 * - Right panel: Centered authentication card with glassmorphism & luxury borders
 * - Top header with MS Mobiles brand logo & "Back to Store" link
 * - Fully responsive across 320px–414px mobile, tablet, and 4K desktop
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Smartphone } from 'lucide-react';
import AuthIllustration from './AuthIllustration';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-dark-950 text-neutral-100 flex flex-col justify-between selection:bg-accent-500 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="relative z-20 w-full px-6 py-4 flex items-center justify-between border-b border-dark-800/60 bg-dark-950/80 backdrop-blur-md">
        {/* Brand Logo */}
        <Link
          to="/"
          className="inline-flex items-center gap-2.5 text-white hover:text-neutral-200 transition-colors group"
        >
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-accent-600 to-sky-500 p-0.5 flex items-center justify-center shadow-glow-sm">
            <div className="w-full h-full bg-dark-950 rounded-[14px] flex items-center justify-center">
              <Smartphone className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <span className="font-extrabold tracking-tight text-base sm:text-lg text-white">
              MS
            </span>
            <span className="text-accent-400 font-extrabold ml-1.5 text-base sm:text-lg">
              Mobiles
            </span>
          </div>
        </Link>

        {/* Return to Store Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white hover:bg-dark-850/80 border border-transparent hover:border-dark-750 transition-all duration-200"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Store</span>
        </Link>
      </header>

      {/* Main Content: Split-Screen Layout */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* Left Decorative Illustration (Desktop Only) */}
        <div className="hidden lg:block lg:col-span-6 xl:col-span-7">
          <AuthIllustration />
        </div>

        {/* Right Form Container (Mobile & Desktop) */}
        <div className="lg:col-span-6 xl:col-span-5 flex items-center justify-center p-6 sm:p-10 xl:p-14 relative">
          {/* Subtle Ambient Background Glow on Mobile */}
          <div className="lg:hidden absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-accent-600/10 rounded-full blur-3xl pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full max-w-md relative z-10 p-6 sm:p-8 rounded-3xl bg-dark-900/70 border border-dark-800/80 backdrop-blur-xl shadow-2xl"
          >
            {children}
          </motion.div>
        </div>
      </main>

      {/* Subtle Footer */}
      <footer className="w-full py-4 text-center border-t border-dark-800/40 text-[11px] text-neutral-400">
        <p>© 2026 MS Mobiles Store. Official Authorized Retailer.</p>
      </footer>
    </div>
  );
};

export default AuthLayout;
