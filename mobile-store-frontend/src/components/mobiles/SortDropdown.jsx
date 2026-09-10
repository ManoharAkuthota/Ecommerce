/**
 * SortDropdown Component
 * Module: components/mobiles/SortDropdown.jsx
 * 
 * Luxury storefront sorting dropdown supporting backend sort parameters:
 * - normal: "Normal"
 * - price_asc: "Price Low → High"
 * - price_desc: "Price High → Low"
 * - latest: "Latest First"
 */

import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpDown, Check, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SORT_OPTIONS = [
  { value: 'normal', label: 'Normal' },
  { value: 'price_asc', label: 'Price Low → High' },
  { value: 'price_desc', label: 'Price High → Low' },
  { value: 'latest', label: 'Latest First' },
];

export const SortDropdown = ({ value = 'normal', onChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption =
    SORT_OPTIONS.find((opt) => opt.value === value) || SORT_OPTIONS[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (sortValue) => {
    onChange?.(sortValue);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Sort products by"
        className="inline-flex items-center justify-between gap-2.5 px-4 py-3 bg-dark-900/80 hover:bg-dark-900 border border-dark-750 hover:border-accent-500/50 rounded-2xl text-xs font-semibold text-neutral-200 hover:text-white transition-all duration-200 shadow-sm backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-accent-500/20"
      >
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-accent-400 shrink-0" />
          <span className="text-neutral-400 font-normal">Sort:</span>
          <span className="text-white font-bold">{selectedOption.label}</span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-accent-400' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            role="listbox"
            className="absolute right-0 mt-2 w-52 rounded-2xl bg-dark-900 border border-dark-750/90 shadow-2xl p-1.5 z-50 backdrop-blur-2xl focus:outline-none"
          >
            <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-neutral-500 border-b border-dark-800 mb-1">
              Sort Criteria
            </div>

            {SORT_OPTIONS.map((option) => {
              const isSelected = option.value === selectedOption.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option.value)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-accent-500/15 text-accent-300 font-bold'
                      : 'text-neutral-300 hover:bg-dark-800 hover:text-white'
                  }`}
                >
                  <span>{option.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-accent-400 shrink-0" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SortDropdown;
