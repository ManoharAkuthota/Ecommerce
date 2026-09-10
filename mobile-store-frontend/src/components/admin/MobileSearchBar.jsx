/**
 * Mobile Search Bar Component
 * Module: components/admin/MobileSearchBar.jsx
 * 
 * Features:
 * - Rounded luxury glassmorphic input
 * - Leading search icon
 * - 300ms debounce typing timer before firing onSearch
 * - Trailing one-click clear button
 * - Keyboard Escape shortcut to clear search
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

export const MobileSearchBar = ({
  value = '',
  onSearch,
  placeholder = 'Search by mobile name...',
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState(value);
  const isFirstRender = useRef(true);

  // Synchronize internal state with external value changes
  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  // Debounce search input (300ms)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      if (typeof onSearch === 'function') {
        onSearch(searchTerm.trim());
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  const handleClear = () => {
    setSearchTerm('');
    if (typeof onSearch === 'function') {
      onSearch('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Search Icon */}
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
        <Search className="w-4 h-4" />
      </div>

      {/* Input Field */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 bg-dark-900/80 border border-dark-700/70 hover:border-dark-600 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 rounded-2xl text-xs sm:text-sm text-white placeholder-neutral-500 transition-all duration-200 outline-none shadow-inner"
        aria-label="Search mobiles"
      />

      {/* Clear Button */}
      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-white transition-colors"
          aria-label="Clear search"
        >
          <div className="w-5 h-5 rounded-full bg-dark-800 hover:bg-dark-700 flex items-center justify-center">
            <X className="w-3 h-3" />
          </div>
        </button>
      )}
    </div>
  );
};

export default MobileSearchBar;
