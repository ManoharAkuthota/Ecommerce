/**
 * ProductSkeleton Component
 * Module: components/mobile-details/ProductSkeleton.jsx
 * 
 * High-fidelity loading skeleton placeholder matching the ProductDetails page layout
 * to eliminate cumulative layout shifts (CLS).
 */

import React from 'react';

export const ProductSkeleton = () => {
  return (
    <div className="space-y-12 sm:space-y-16 animate-pulse select-none">
      {/* 1. Breadcrumb Skeleton */}
      <div className="flex items-center gap-2">
        <div className="w-12 h-3 bg-dark-800 rounded" />
        <div className="w-2 h-3 bg-dark-800 rounded" />
        <div className="w-16 h-3 bg-dark-800 rounded" />
        <div className="w-2 h-3 bg-dark-800 rounded" />
        <div className="w-28 h-3 bg-dark-800 rounded" />
      </div>

      {/* 2. Showcase Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left: Gallery Skeleton */}
        <div className="lg:col-span-6 space-y-4">
          <div className="w-full aspect-[4/3.8] sm:aspect-square bg-dark-900/60 border border-dark-800/80 rounded-3xl" />
          <div className="flex items-center gap-3">
            <div className="w-18 h-18 bg-dark-900/60 rounded-2xl" />
            <div className="w-18 h-18 bg-dark-900/60 rounded-2xl" />
            <div className="w-18 h-18 bg-dark-900/60 rounded-2xl" />
          </div>
        </div>

        {/* Right: Info Skeleton */}
        <div className="lg:col-span-6 space-y-6 sm:space-y-8">
          <div className="flex items-center justify-between">
            <div className="w-24 h-6 bg-dark-800 rounded-full" />
            <div className="w-20 h-6 bg-dark-800 rounded-full" />
          </div>

          <div className="space-y-3">
            <div className="w-3/4 h-10 bg-dark-800 rounded-xl" />
            <div className="w-40 h-8 bg-dark-800 rounded-lg" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="h-16 bg-dark-900/60 rounded-2xl" />
            <div className="h-16 bg-dark-900/60 rounded-2xl" />
            <div className="h-16 bg-dark-900/60 rounded-2xl col-span-2" />
          </div>

          <div className="w-full h-14 bg-dark-800 rounded-2xl" />
          <div className="w-full h-20 bg-dark-900/40 rounded-2xl" />
        </div>
      </div>

      {/* 3. Specifications Table Skeleton */}
      <div className="space-y-4 pt-6">
        <div className="w-48 h-8 bg-dark-800 rounded-xl" />
        <div className="w-full h-64 bg-dark-900/50 border border-dark-800/60 rounded-3xl" />
      </div>

      {/* 4. Related Products Skeleton */}
      <div className="space-y-6 pt-6">
        <div className="w-40 h-7 bg-dark-800 rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-64 bg-dark-900/40 border border-dark-800 rounded-3xl" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
