/**
 * ThumbnailStrip Component
 * Module: components/mobile-details/ThumbnailStrip.jsx
 * 
 * Displays ordered thumbnails of product images with active selection indicator,
 * hover preview, and smooth switching.
 */

import React from 'react';
import { Smartphone } from 'lucide-react';

export const ThumbnailStrip = ({
  images = [],
  selectedIndex = 0,
  onSelectIndex,
  productName = 'Smartphone',
  className = '',
}) => {
  if (!images || images.length <= 1) return null;

  return (
    <div
      role="tablist"
      aria-label="Product image thumbnails"
      className={`flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none select-none ${className}`}
    >
      {images.map((imgUrl, index) => {
        const isSelected = selectedIndex === index;
        return (
          <button
            key={`${imgUrl}-${index}`}
            type="button"
            role="tab"
            aria-selected={isSelected}
            aria-label={`View image ${index + 1} of ${images.length} for ${productName}`}
            onClick={() => onSelectIndex?.(index)}
            className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-dark-950/80 border p-2 shrink-0 transition-all duration-200 cursor-pointer ${
              isSelected
                ? 'border-accent-500 ring-2 ring-accent-500/30 shadow-glow-sm scale-105'
                : 'border-dark-800 hover:border-dark-700 hover:scale-[1.02] opacity-70 hover:opacity-100'
            }`}
          >
            {imgUrl ? (
              <img
                src={imgUrl}
                alt={`${productName} thumbnail ${index + 1}`}
                className="w-full h-full object-contain pointer-events-none"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-600">
                <Smartphone className="w-5 h-5" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ThumbnailStrip;
