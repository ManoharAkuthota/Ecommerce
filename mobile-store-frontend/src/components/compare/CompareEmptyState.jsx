/**
 * Compare Empty State Component
 * Module: components/compare/CompareEmptyState.jsx
 * 
 * Luxury placeholder shown when no smartphones are currently in comparison:
 * - Ambient glassmorphic card with layered radial glow
 * - Reassuring typography & feature breakdown
 * - Primary CTA directing customers to /mobiles
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftRight, Smartphone, Sparkles, PlusCircle } from 'lucide-react';

const CompareEmptyState = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-3xl bg-dark-900/40 border border-dark-800/80 p-8 sm:p-12 text-center backdrop-blur-xl shadow-xl max-w-2xl mx-auto my-6"
    >
      {/* Ambient Radial Halo */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        {/* Icon Illustration */}
        <div className="relative w-20 h-20 rounded-3xl bg-dark-850/90 border border-dark-750 flex items-center justify-center text-accent-400 mb-6 shadow-glow-sm">
          <ArrowLeftRight className="w-9 h-9 text-accent-400 stroke-[1.8]" />
          <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-accent-500 text-white text-[11px] font-black flex items-center justify-center border-2 border-dark-900">
            0
          </span>
        </div>

        {/* Headline & Copy */}
        <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          Your comparison list is empty
        </h3>
        <p className="text-xs sm:text-sm text-neutral-400 mt-2.5 max-w-md leading-relaxed">
          Select up to 4 flagship smartphones anywhere in the store to compare processors, displays, cameras, battery capacities, and prices side by side.
        </p>

        {/* Feature Micro-Badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-[11px] text-neutral-400 font-medium">
          <span className="px-3 py-1 rounded-full bg-dark-850 border border-dark-750 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-accent-400" />
            <span>Up to 4 Flagships</span>
          </span>
          <span className="px-3 py-1 rounded-full bg-dark-850 border border-dark-750 flex items-center gap-1.5">
            <Smartphone className="w-3 h-3 text-sky-400" />
            <span>Detailed Hardware Specs</span>
          </span>
          <span className="px-3 py-1 rounded-full bg-dark-850 border border-dark-750 flex items-center gap-1.5">
            <ArrowLeftRight className="w-3 h-3 text-emerald-400" />
            <span>Side-by-Side Analysis</span>
          </span>
        </div>

        {/* Primary CTA */}
        <div className="mt-8">
          <Link
            to="/mobiles"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-accent-600 hover:bg-accent-500 text-white text-xs sm:text-sm font-bold shadow-glow-sm hover:shadow-glow-md transition-all duration-200"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Browse Smartphones</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CompareEmptyState;
