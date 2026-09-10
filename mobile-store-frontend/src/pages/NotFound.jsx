/**
 * 404 Not Found Page Component
 * Module: pages/NotFound.jsx
 * 
 * Luxury 404 screen featuring ambient glow, Framer Motion entrance,
 * quick navigation actions, and full MS Mobiles branding.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Smartphone, Home, Compass, ArrowRight, HelpCircle } from 'lucide-react';
import SEO from '../components/common/SEO';

export const NotFound = () => {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center py-16 px-4 sm:px-6 select-none overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      <SEO
        title="404 - Page Not Found | MS Mobiles"
        description="The smartphone showcase or page you are looking for has been relocated or does not exist."
      />

      {/* Ambient Radial Glows */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[24rem] bg-accent-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-purple-600/8 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="max-w-xl w-full text-center space-y-8"
      >
        {/* Glowing 404 Artwork Emblem */}
        <div className="relative mx-auto w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center">
          <div className="absolute inset-0 rounded-3xl bg-accent-500/15 blur-2xl animate-pulse" />
          <div className="relative w-full h-full rounded-3xl bg-dark-900/80 border border-dark-750 backdrop-blur-xl flex flex-col items-center justify-center shadow-2xl space-y-1">
            <Smartphone className="w-10 h-10 text-accent-400 stroke-[1.75]" />
            <span className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tighter">
              404
            </span>
          </div>
        </div>

        {/* Copy */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-accent-500/10 border border-accent-500/25 text-accent-300 text-xs font-mono font-bold uppercase tracking-wider">
            <span>Destination Unavailable</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Page Not Found
          </h1>

          <p className="text-sm sm:text-base text-neutral-400 max-w-md mx-auto leading-relaxed font-sans">
            The page or flagship device showcase you are looking for has been relocated, retired, or never existed.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/mobiles"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-accent-600 hover:bg-accent-500 text-white text-xs sm:text-sm font-bold shadow-glow-sm hover:shadow-glow-md transition-all group"
          >
            <Compass className="w-4 h-4 text-white" />
            <span>Explore Mobiles</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-dark-850 hover:bg-dark-800 text-neutral-200 hover:text-white text-xs sm:text-sm font-bold border border-dark-750 transition-all"
          >
            <Home className="w-4 h-4 text-accent-400" />
            <span>Return to Home</span>
          </Link>
        </div>

        {/* Assistance Hint */}
        <div className="pt-6 border-t border-dark-850">
          <p className="text-xs text-neutral-500 flex items-center justify-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-neutral-400" />
            <span>Need assistance? Reach our concierge team on the </span>
            <Link to="/contact" className="text-accent-400 hover:underline font-semibold">
              Contact page
            </Link>
            .
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
