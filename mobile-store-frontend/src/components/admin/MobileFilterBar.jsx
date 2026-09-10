/**
 * Mobile Filter Bar Component
 * Module: components/admin/MobileFilterBar.jsx
 * 
 * Provides filter controls:
 * - Brand dropdown (All Brands, Apple, Samsung, etc.)
 * - Stock Status dropdown (All, In Stock, Limited Stock, Out of Stock)
 * - Visibility dropdown (All, Visible, Hidden)
 * - Sort dropdown (Normal, Price Low → High, Price High → Low, Latest First)
 * - Clear Filters reset button
 */

import React from 'react';
import { Filter, RotateCcw, ChevronDown } from 'lucide-react';

const STOCK_OPTIONS = [
  { value: 'all', label: 'All Stock' },
  { value: 'IN_STOCK', label: 'In Stock' },
  { value: 'LIMITED_STOCK', label: 'Limited Stock' },
  { value: 'OUT_OF_STOCK', label: 'Out of Stock' },
];

const VISIBILITY_OPTIONS = [
  { value: 'all', label: 'All Visibility' },
  { value: 'visible', label: 'Visible Only' },
  { value: 'hidden', label: 'Hidden Only' },
];

const SORT_OPTIONS = [
  { value: 'normal', label: 'Default Sort' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'latest', label: 'Latest First' },
];

export const MobileFilterBar = ({
  brand = 'all',
  stock = 'all',
  visibility = 'all',
  sort = 'normal',
  availableBrands = [],
  onFilterChange,
  onResetFilters,
  className = '',
}) => {
  const isFiltered =
    brand !== 'all' || stock !== 'all' || visibility !== 'all' || sort !== 'normal';

  const selectBaseClass =
    'w-full sm:w-auto appearance-none pl-3.5 pr-8 py-2 bg-dark-900/80 border border-dark-700/70 hover:border-dark-600 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 rounded-2xl text-xs sm:text-sm text-neutral-200 outline-none transition-all cursor-pointer shadow-inner';

  return (
    <div
      className={`flex flex-wrap items-center gap-2.5 p-3 rounded-2xl bg-dark-950/60 border border-dark-800/80 backdrop-blur-xl ${className}`}
    >
      {/* Filter Label / Icon */}
      <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-neutral-400 pl-1 pr-2 border-r border-dark-800">
        <Filter className="w-3.5 h-3.5 text-accent-400" />
        <span>Filters</span>
      </div>

      {/* Brand Select */}
      <div className="relative flex-1 min-w-[130px] sm:flex-initial">
        <select
          value={brand}
          onChange={(e) => onFilterChange('brand', e.target.value)}
          className={selectBaseClass}
          aria-label="Filter by Brand"
        >
          <option value="all" className="bg-dark-900 text-white">
            All Brands
          </option>
          {availableBrands.map((b) => (
            <option key={b} value={b} className="bg-dark-900 text-white">
              {b}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Stock Status Select */}
      <div className="relative flex-1 min-w-[130px] sm:flex-initial">
        <select
          value={stock}
          onChange={(e) => onFilterChange('stock', e.target.value)}
          className={selectBaseClass}
          aria-label="Filter by Stock Status"
        >
          {STOCK_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-dark-900 text-white">
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Visibility Select */}
      <div className="relative flex-1 min-w-[130px] sm:flex-initial">
        <select
          value={visibility}
          onChange={(e) => onFilterChange('visibility', e.target.value)}
          className={selectBaseClass}
          aria-label="Filter by Visibility"
        >
          {VISIBILITY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-dark-900 text-white">
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Sort Select */}
      <div className="relative flex-1 min-w-[140px] sm:flex-initial">
        <select
          value={sort}
          onChange={(e) => onFilterChange('sort', e.target.value)}
          className={selectBaseClass}
          aria-label="Sort products"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-dark-900 text-white">
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Reset Filters Button */}
      {isFiltered && (
        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-dark-850 hover:bg-dark-800 text-xs font-bold text-neutral-300 hover:text-white border border-dark-700/60 transition-colors ml-auto sm:ml-0"
          title="Reset all filters"
        >
          <RotateCcw className="w-3 h-3 text-accent-400" />
          <span>Reset</span>
        </button>
      )}
    </div>
  );
};

export default MobileFilterBar;
