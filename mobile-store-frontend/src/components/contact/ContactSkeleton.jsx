/**
 * ContactSkeleton Component
 * Module: components/contact/ContactSkeleton.jsx
 * 
 * Reusable loading skeleton placeholder matching the Contact page layout.
 */

import React from 'react';

export const ContactSkeleton = () => {
  return (
    <div className="space-y-12 animate-pulse select-none">
      {/* Hero Skeleton */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <div className="w-36 h-6 bg-dark-800 rounded-full mx-auto" />
        <div className="w-3/4 h-12 bg-dark-800 rounded-2xl mx-auto" />
        <div className="w-full h-4 bg-dark-800 rounded-lg mx-auto" />
      </div>

      {/* Quick Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 rounded-3xl bg-dark-900/60 border border-dark-800/80 p-6 space-y-2" />
        ))}
      </div>

      {/* Two-Column Form + Info Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10">
        <div className="lg:col-span-7 h-96 rounded-3xl bg-dark-900/60 border border-dark-800/80" />
        <div className="lg:col-span-5 space-y-6">
          <div className="h-64 rounded-3xl bg-dark-900/60 border border-dark-800/80" />
          <div className="h-44 rounded-3xl bg-dark-900/60 border border-dark-800/80" />
        </div>
      </div>
    </div>
  );
};

export default ContactSkeleton;
