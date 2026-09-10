/**
 * SearchBar Component
 * Module: components/mobiles/SearchBar.jsx
 * 
 * Luxury storefront search input with:
 * - Search icon and clear button
 * - Rounded design with smooth focus glow
 * - 300ms debouncing using useDebounce hook
 * - Placeholder: "Search mobiles by name..."
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import useDebounce from '../../hooks/useDebounce';

export const SearchBar = ({
  value: controlledValue,
  onSearch,
  placeholder = 'Search mobiles by name...',
  isLoading = false,
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState(controlledValue || '');
  const debouncedTerm = useDebounce(searchTerm, 300);
  const isFirstMount = useRef(true);
  const inputRef = useRef(null);

  // Synchronize internal state if parent value changes externally (e.g. filter chips clear)
  useEffect(() => {
    if (controlledValue !== undefined && controlledValue !== searchTerm) {
      setSearchTerm(controlledValue || '');
    }
  }, [controlledValue]);

  // Trigger parent onSearch callback when debounced term updates
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    onSearch?.(debouncedTerm);
  }, [debouncedTerm]);

  const handleClear = () => {
    setSearchTerm('');
    onSearch?.('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Search Icon / Spinner */}
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-accent-400" />
        ) : (
          <Search className="w-4 h-4 transition-colors group-focus-within:text-accent-400" />
        )}
      </div>

      {/* Text Input */}
      <input
        ref={inputRef}
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label="Search mobiles by name"
        className="w-full pl-11 pr-11 py-3 bg-dark-900/80 hover:bg-dark-900 focus:bg-dark-900 border border-dark-750 focus:border-accent-500/60 rounded-2xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 shadow-inner backdrop-blur-xl transition-all duration-200"
      />

      {/* Clear Button */}
      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search input"
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-white transition-colors"
        >
          <div className="p-1 rounded-full hover:bg-dark-800 text-neutral-400 hover:text-white transition-colors">
            <X className="w-3.5 h-3.5" />
          </div>
        </button>
      )}
    </div>
  );
};

export default SearchBar;
