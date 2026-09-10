/**
 * Mobile Table Skeleton Loader Component
 * Module: components/admin/MobileTableSkeleton.jsx
 * 
 * Renders pulse placeholder skeletons for both desktop table and mobile card layouts.
 */

import React from 'react';

export const MobileTableSkeleton = ({ rowCount = 5 }) => {
  const rows = Array.from({ length: rowCount });

  return (
    <div className="w-full space-y-4">
      {/* Desktop Skeleton Table (lg:block) */}
      <div className="hidden lg:block rounded-2xl border border-dark-800/80 bg-dark-950/60 backdrop-blur-xl overflow-hidden shadow-card">
        <div className="p-4 border-b border-dark-800/80 flex items-center gap-6 animate-pulse">
          <div className="w-12 h-4 bg-dark-800 rounded" />
          <div className="w-32 h-4 bg-dark-800 rounded" />
          <div className="w-20 h-4 bg-dark-800 rounded" />
          <div className="w-16 h-4 bg-dark-800 rounded" />
          <div className="w-16 h-4 bg-dark-800 rounded" />
          <div className="w-24 h-4 bg-dark-800 rounded" />
          <div className="w-20 h-4 bg-dark-800 rounded" />
          <div className="w-20 h-4 bg-dark-800 rounded" />
          <div className="w-8 h-4 bg-dark-800 rounded ml-auto" />
        </div>

        <div className="divide-y divide-dark-800/60">
          {rows.map((_, i) => (
            <div
              key={i}
              className="p-4 flex items-center gap-6 animate-pulse"
            >
              {/* Image thumbnail skeleton */}
              <div className="w-12 h-12 rounded-xl bg-dark-800 flex-shrink-0" />

              {/* Product info skeleton */}
              <div className="w-48 space-y-2">
                <div className="w-36 h-4 bg-dark-800 rounded" />
                <div className="w-24 h-3 bg-dark-850 rounded" />
              </div>

              {/* Brand */}
              <div className="w-20">
                <div className="w-16 h-4 bg-dark-800 rounded" />
              </div>

              {/* Price */}
              <div className="w-20">
                <div className="w-16 h-4 bg-dark-800 rounded" />
              </div>

              {/* RAM & Storage */}
              <div className="w-24">
                <div className="w-20 h-4 bg-dark-800 rounded" />
              </div>

              {/* Stock status badge */}
              <div className="w-28">
                <div className="w-24 h-6 bg-dark-800 rounded-full" />
              </div>

              {/* Visibility badge */}
              <div className="w-24">
                <div className="w-20 h-6 bg-dark-800 rounded-full" />
              </div>

              {/* Date */}
              <div className="w-24">
                <div className="w-18 h-3 bg-dark-850 rounded" />
              </div>

              {/* Action button */}
              <div className="ml-auto">
                <div className="w-8 h-8 rounded-lg bg-dark-800" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Skeleton Cards (lg:hidden) */}
      <div className="block lg:hidden space-y-3">
        {rows.map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-2xl bg-dark-950/60 border border-dark-800/80 backdrop-blur-xl animate-pulse space-y-3 shadow-card"
          >
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-dark-800 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="w-32 h-4 bg-dark-800 rounded" />
                <div className="w-20 h-3 bg-dark-850 rounded" />
              </div>
              <div className="w-8 h-8 rounded-lg bg-dark-800" />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-dark-800/60">
              <div className="w-20 h-5 bg-dark-800 rounded" />
              <div className="flex gap-2">
                <div className="w-20 h-5 bg-dark-800 rounded-full" />
                <div className="w-16 h-5 bg-dark-800 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileTableSkeleton;
