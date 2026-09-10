/**
 * FilterSidebar Component
 * Module: components/mobiles/FilterSidebar.jsx
 * 
 * Multi-criteria filter sidebar supporting Brand, RAM, and Storage options.
 * Features:
 * - Desktop sticky left sidebar
 * - Mobile slide-up sheet drawer with Framer Motion backdrop & close button
 * - Brand options: Apple, Samsung, OnePlus, Nothing, Xiaomi, Vivo, Oppo, Realme, Google, Motorola
 * - RAM options: 4GB, 6GB, 8GB, 12GB, 16GB
 * - Storage options: 64GB, 128GB, 256GB, 512GB, 1TB
 * - Active counts and Reset Filters button
 */

import React from 'react';
import { Filter, X, RotateCcw, Check, SlidersHorizontal, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const BRANDS = [
  'Apple',
  'Samsung',
  'OnePlus',
  'Nothing',
  'Xiaomi',
  'Vivo',
  'Oppo',
  'Realme',
  'Google',
  'Motorola',
];

export const RAM_OPTIONS = ['4GB', '6GB', '8GB', '12GB', '16GB'];

export const STORAGE_OPTIONS = ['64GB', '128GB', '256GB', '512GB', '1TB'];

export const FilterSidebar = ({
  filters = {},
  onFilterChange,
  onResetFilters,
  isMobileOpen = false,
  onMobileClose,
  totalResults = 0,
}) => {
  const activeFilterCount =
    (filters.brand ? 1 : 0) + (filters.ram ? 1 : 0) + (filters.storage ? 1 : 0);

  const handleToggle = (key, value) => {
    // If currently selected, clear it (toggle behavior), otherwise set it
    const nextValue = filters[key] === value ? '' : value;
    onFilterChange?.(key, nextValue);
  };

  // Shared Filter Sections Body
  const FilterContent = () => (
    <div className="space-y-6">
      {/* 1. Header with Reset Action */}
      <div className="flex items-center justify-between pb-4 border-b border-dark-800">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-accent-400" />
          <span className="text-sm font-bold text-white tracking-wide">Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-accent-500 text-white text-[10px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-accent-300 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* 2. Brand Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold">
            Manufacturer
          </span>
          {filters.brand && (
            <span className="text-[11px] text-accent-400 font-medium">
              {filters.brand}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {BRANDS.map((brand) => {
            const isSelected = filters.brand === brand;
            return (
              <button
                key={brand}
                type="button"
                onClick={() => handleToggle('brand', brand)}
                className={`px-3 py-2 rounded-xl text-xs font-medium text-left transition-all duration-150 flex items-center justify-between ${
                  isSelected
                    ? 'bg-accent-500/20 text-white font-bold border border-accent-500/40 shadow-sm'
                    : 'bg-dark-850/60 hover:bg-dark-850 text-neutral-300 border border-dark-800/80 hover:border-dark-700'
                }`}
              >
                <span className="truncate">{brand}</span>
                {isSelected && <Check className="w-3 h-3 text-accent-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. RAM Section */}
      <div className="space-y-3 pt-2 border-t border-dark-850">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold">
            Memory (RAM)
          </span>
          {filters.ram && (
            <span className="text-[11px] text-accent-400 font-medium">
              {filters.ram}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {RAM_OPTIONS.map((ram) => {
            const isSelected = filters.ram === ram;
            return (
              <button
                key={ram}
                type="button"
                onClick={() => handleToggle('ram', ram)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-accent-500 text-white font-bold shadow-glow-sm'
                    : 'bg-dark-850/60 hover:bg-dark-850 text-neutral-300 border border-dark-800/80 hover:border-dark-700'
                }`}
              >
                {ram}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Storage Section */}
      <div className="space-y-3 pt-2 border-t border-dark-850">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold">
            Internal Storage
          </span>
          {filters.storage && (
            <span className="text-[11px] text-accent-400 font-medium">
              {filters.storage}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {STORAGE_OPTIONS.map((storage) => {
            const isSelected = filters.storage === storage;
            return (
              <button
                key={storage}
                type="button"
                onClick={() => handleToggle('storage', storage)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-accent-500 text-white font-bold shadow-glow-sm'
                    : 'bg-dark-850/60 hover:bg-dark-850 text-neutral-300 border border-dark-800/80 hover:border-dark-700'
                }`}
              >
                {storage}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-24 p-6 rounded-3xl bg-dark-900/60 border border-dark-800/80 backdrop-blur-xl shadow-card">
          <FilterContent />
        </div>
      </aside>

      {/* ================= MOBILE SLIDE-UP DRAWER ================= */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Slide-Up Sheet Panel */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="relative w-full max-h-[85vh] overflow-y-auto rounded-t-3xl bg-dark-900 border-t border-dark-750 p-6 shadow-2xl z-10"
            >
              {/* Top Handle bar */}
              <div className="w-12 h-1.5 rounded-full bg-dark-750 mx-auto mb-5" />

              <div className="flex items-center justify-between pb-4 mb-2 border-b border-dark-800">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-accent-400" />
                  <span className="text-base font-bold text-white">Filter Smartphones</span>
                </div>
                <button
                  type="button"
                  onClick={onMobileClose}
                  aria-label="Close filter drawer"
                  className="p-1.5 rounded-full hover:bg-dark-800 text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <FilterContent />

              {/* Mobile Action Footer */}
              <div className="mt-8 pt-4 border-t border-dark-800 flex items-center gap-3">
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      onResetFilters?.();
                      onMobileClose?.();
                    }}
                    className="flex-1 py-3 rounded-2xl bg-dark-800 hover:bg-dark-750 text-white text-xs font-bold transition-colors"
                  >
                    Reset
                  </button>
                )}
                <button
                  type="button"
                  onClick={onMobileClose}
                  className="flex-1 py-3 rounded-2xl bg-accent-600 hover:bg-accent-500 text-white text-xs font-bold transition-colors shadow-glow-sm"
                >
                  Apply Filters {totalResults > 0 ? `(${totalResults})` : ''}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FilterSidebar;
