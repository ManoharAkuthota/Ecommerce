/**
 * FilterChips Component
 * Module: components/mobiles/FilterChips.jsx
 * 
 * Displays active filter chips above the product grid with individual removal
 * and "Clear All" functionality.
 */

import React from 'react';
import { X, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const FilterChips = ({
  filters = {},
  onRemoveFilter,
  onClearAll,
  className = '',
}) => {
  const chips = [];

  if (filters.name && filters.name.trim()) {
    chips.push({
      key: 'name',
      label: `Search: "${filters.name.trim()}"`,
    });
  }

  if (filters.brand && filters.brand.trim()) {
    chips.push({
      key: 'brand',
      label: `Brand: ${filters.brand}`,
    });
  }

  if (filters.ram && filters.ram.trim()) {
    chips.push({
      key: 'ram',
      label: `RAM: ${filters.ram}`,
    });
  }

  if (filters.storage && filters.storage.trim()) {
    chips.push({
      key: 'storage',
      label: `Storage: ${filters.storage}`,
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 pt-2 ${className}`}>
      <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 mr-1">
        Active Filters:
      </span>

      <AnimatePresence>
        {chips.map((chip) => (
          <motion.div
            key={chip.key}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.18 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/25 text-accent-300 text-xs font-medium shadow-sm"
          >
            <span>{chip.label}</span>
            <button
              type="button"
              onClick={() => onRemoveFilter?.(chip.key)}
              aria-label={`Remove filter for ${chip.label}`}
              className="p-0.5 rounded-full hover:bg-accent-500/20 text-accent-400 hover:text-white transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      {chips.length > 1 && (
        <button
          type="button"
          onClick={onClearAll}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Clear All</span>
        </button>
      )}
    </div>
  );
};

export default FilterChips;
