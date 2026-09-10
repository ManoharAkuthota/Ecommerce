/**
 * MobileSkeleton Component
 * Module: components/mobiles/MobileSkeleton.jsx
 * 
 * Reusable animated loading skeleton card matching MobileCard dimensions to eliminate layout shifts.
 */

import React from 'react';

export const MobileSkeleton = () => {
  return (
    <div className="flex flex-col justify-between rounded-3xl bg-dark-900/40 border border-dark-800/60 p-5 space-y-4 animate-pulse">
      {/* Badges row */}
      <div className="flex items-center justify-between">
        <div className="w-20 h-5 bg-dark-800 rounded-full" />
        <div className="w-16 h-5 bg-dark-800 rounded-md" />
      </div>

      {/* Image frame */}
      <div className="w-full aspect-[4/3.4] bg-dark-850 rounded-2xl" />

      {/* Title & Specs */}
      <div className="space-y-2 pt-1">
        <div className="w-14 h-3 bg-dark-800 rounded" />
        <div className="w-3/4 h-5 bg-dark-800 rounded" />
        <div className="flex gap-2 mt-2">
          <div className="w-24 h-6 bg-dark-850 rounded-lg" />
          <div className="w-20 h-6 bg-dark-850 rounded-lg" />
        </div>
      </div>

      {/* Price & Button */}
      <div className="pt-4 border-t border-dark-850 flex items-center justify-between">
        <div className="space-y-1">
          <div className="w-12 h-2.5 bg-dark-800 rounded" />
          <div className="w-20 h-6 bg-dark-800 rounded" />
        </div>
        <div className="w-24 h-8 bg-dark-850 rounded-xl" />
      </div>
    </div>
  );
};

export const MobileGridSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <MobileSkeleton key={index} />
      ))}
    </div>
  );
};

export default MobileSkeleton;
