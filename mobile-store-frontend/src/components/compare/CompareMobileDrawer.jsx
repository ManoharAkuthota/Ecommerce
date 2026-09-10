/**
 * Mobile Compare Drawer / Carousel Component
 * Module: components/compare/CompareMobileDrawer.jsx
 * 
 * Horizontally scrollable comparison slider for smaller screens (< 768px):
 * - Smooth scroll-snap touch carousel
 * - Visual card indicators (1 of 4, 2 of 4)
 * - Renders CompareCard components with specifications
 */

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowLeftRight } from 'lucide-react';
import CompareCard from './CompareCard';

const CompareMobileDrawer = ({ items = [] }) => {
  const scrollRef = useRef(null);

  if (!items || items.length === 0) return null;

  const handleScroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === 'left' ? -300 : 300;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className="w-full space-y-3 md:hidden">
      {/* Scroll Controls Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400">
          <ArrowLeftRight className="w-3.5 h-3.5 text-accent-400" />
          <span>Swipe to compare ({items.length} mobiles)</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleScroll('left')}
            aria-label="Scroll left"
            className="p-1.5 rounded-lg bg-dark-850 border border-dark-800 text-neutral-400 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleScroll('right')}
            aria-label="Scroll right"
            className="p-1.5 rounded-lg bg-dark-850 border border-dark-800 text-neutral-400 hover:text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Snap Scroll Area */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item) => (
          <div key={item.mobileId || item.id} className="snap-start">
            <CompareCard item={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompareMobileDrawer;
