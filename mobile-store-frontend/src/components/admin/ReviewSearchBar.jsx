/**
 * Review Search Bar Component
 * Module: components/admin/ReviewSearchBar.jsx
 * 
 * Features:
 * - 300ms debounced search input
 * - Search by customer name or purchased phone
 * - Clear button and Escape key shortcut
 * - Smooth focus ring and glassmorphic styling
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';

export const ReviewSearchBar = ({
  value = '',
  onChange,
  placeholder = 'Search by customer name or phone...',
  debounceMs = 300,
  isLoading = false,
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState(value);
  const debounceTimerRef = useRef(null);

  // Synchronize local input state if external value changes
  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  const handleInputChange = (e) => {
    const nextVal = e.target.value;
    setSearchTerm(nextVal);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (typeof onChange === 'function') {
        onChange(nextVal);
      }
    }, debounceMs);
  };

  const handleClear = () => {
    setSearchTerm('');
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    if (typeof onChange === 'function') {
      onChange('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className={`relative flex items-center w-full ${className}`}>
      {/* Search Icon or Loading Spinner */}
      <div className="absolute left-3.5 flex items-center pointer-events-none text-neutral-400">
        {isLoading ? (
          <Loader2 className="w-4 h-4 text-accent-400 animate-spin" />
        ) : (
          <Search className="w-4 h-4 text-neutral-400" />
        )}
      </div>

      {/* Input */}
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label="Search reviews"
        className="w-full pl-10 pr-10 py-2.5 bg-dark-900/80 hover:bg-dark-900 border border-dark-700/80 hover:border-dark-600 focus:border-accent-500/80 focus:ring-2 focus:ring-accent-500/20 rounded-2xl text-xs sm:text-sm text-white placeholder-neutral-500 transition-all duration-200 outline-none backdrop-blur-xl shadow-inner"
      />

      {/* Clear Button */}
      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-dark-800 transition-colors"
          aria-label="Clear search"
          title="Clear search (Esc)"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default ReviewSearchBar;
