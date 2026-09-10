/**
 * Rating Filter Dropdown Component
 * Module: components/admin/RatingFilter.jsx
 * 
 * Allows filtering customer reviews by star rating:
 * - All Ratings (null)
 * - 5 Stars
 * - 4 Stars
 * - 3 Stars
 * - 2 Stars
 * - 1 Star
 */

import React from 'react';
import { Star, ChevronDown, Filter } from 'lucide-react';

const RATING_OPTIONS = [
  { value: 'ALL', label: 'All Ratings', stars: null },
  { value: '5', label: '5 Stars', stars: 5 },
  { value: '4', label: '4 Stars', stars: 4 },
  { value: '3', label: '3 Stars', stars: 3 },
  { value: '2', label: '2 Stars', stars: 2 },
  { value: '1', label: '1 Star', stars: 1 },
];

export const RatingFilter = ({
  value = 'ALL',
  onChange,
  className = '',
  disabled = false,
}) => {
  return (
    <div className={`relative inline-block ${className}`}>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          aria-label="Filter reviews by rating"
          className="w-full sm:w-44 pl-9 pr-8 py-2.5 bg-dark-900/80 hover:bg-dark-900 border border-dark-700/80 hover:border-dark-600 focus:border-accent-500/80 focus:ring-2 focus:ring-accent-500/20 rounded-2xl text-xs sm:text-sm font-medium text-white appearance-none cursor-pointer transition-all duration-200 outline-none backdrop-blur-xl shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {RATING_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-dark-900 text-white py-1">
              {opt.label}
            </option>
          ))}
        </select>

        {/* Left Icon */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-amber-400">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
        </div>

        {/* Right Caret */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export default RatingFilter;
