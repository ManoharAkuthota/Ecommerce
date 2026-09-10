/**
 * EmptyState Component
 * Module: components/mobiles/EmptyState.jsx
 * 
 * Luxury empty state displayed when no smartphones match search/filtering criteria.
 */

import React from 'react';
import { Smartphone, RotateCcw, SearchX } from 'lucide-react';
import { motion } from 'framer-motion';

export const EmptyState = ({
  title = 'No Smartphones Found',
  description = 'We could not find any flagship devices matching your current search or filter combination.',
  onResetFilters,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`flex flex-col items-center justify-center p-12 sm:p-16 rounded-3xl bg-dark-900/40 border border-dark-800 text-center max-w-lg mx-auto ${className}`}
    >
      {/* Icon with ambient glow */}
      <div className="relative mb-5">
        <div className="absolute inset-0 bg-accent-500/20 rounded-full blur-xl pointer-events-none" />
        <div className="relative w-16 h-16 rounded-2xl bg-dark-850 border border-dark-750 flex items-center justify-center text-accent-400 shadow-inner">
          <SearchX className="w-8 h-8 text-accent-400" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-white tracking-tight mb-2">
        {title}
      </h3>

      <p className="text-sm text-neutral-400 max-w-sm leading-relaxed mb-6 font-sans">
        {description}
      </p>

      {onResetFilters && (
        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-600 hover:bg-accent-500 text-white text-xs font-bold transition-all duration-200 shadow-glow-sm hover:scale-[1.02]"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset All Filters</span>
        </button>
      )}
    </motion.div>
  );
};

export default EmptyState;
