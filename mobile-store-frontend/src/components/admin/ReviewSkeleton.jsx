/**
 * Review Loading Skeleton Component
 * Module: components/admin/ReviewSkeleton.jsx
 * 
 * Provides animated shimmer placeholders for desktop table rows
 * and mobile review cards while data is hydrating from the backend.
 */

import React from 'react';

export const ReviewSkeleton = ({ rows = 5 }) => {
  return (
    <>
      {/* Desktop Table Skeletons */}
      <tbody className="hidden lg:table-row-group divide-y divide-dark-800">
        {Array.from({ length: rows }).map((_, index) => (
          <tr key={index} className="animate-pulse">
            {/* Customer Avatar & Name */}
            <td className="py-4 px-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-dark-800 flex-shrink-0" />
                <div className="space-y-1.5">
                  <div className="w-24 h-3.5 bg-dark-800 rounded-md" />
                  <div className="w-16 h-2.5 bg-dark-850 rounded-md" />
                </div>
              </div>
            </td>

            {/* Purchased Phone */}
            <td className="py-4 px-4">
              <div className="w-28 h-5 bg-dark-800 rounded-lg" />
            </td>

            {/* Rating Stars */}
            <td className="py-4 px-4">
              <div className="w-20 h-4 bg-dark-800 rounded-md" />
            </td>

            {/* Review Text */}
            <td className="py-4 px-4">
              <div className="space-y-1.5 max-w-sm">
                <div className="w-full h-3 bg-dark-800 rounded-md" />
                <div className="w-3/4 h-3 bg-dark-850 rounded-md" />
              </div>
            </td>

            {/* Date */}
            <td className="py-4 px-4 whitespace-nowrap">
              <div className="w-20 h-3 bg-dark-800 rounded-md" />
            </td>

            {/* Action */}
            <td className="py-4 px-4 text-right whitespace-nowrap">
              <div className="w-7 h-7 bg-dark-800 rounded-xl ml-auto" />
            </td>
          </tr>
        ))}
      </tbody>

      {/* Mobile Card Skeletons */}
      <div className="lg:hidden space-y-3.5 p-4">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="p-4 rounded-2xl bg-dark-900/60 border border-dark-800 space-y-3.5 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-dark-800 flex-shrink-0" />
                <div className="space-y-1.5">
                  <div className="w-24 h-3.5 bg-dark-800 rounded-md" />
                  <div className="w-16 h-2.5 bg-dark-850 rounded-md" />
                </div>
              </div>
              <div className="w-16 h-4 bg-dark-800 rounded-md" />
            </div>

            <div className="w-32 h-5 bg-dark-800 rounded-lg" />

            <div className="space-y-1.5">
              <div className="w-full h-3 bg-dark-800 rounded-md" />
              <div className="w-2/3 h-3 bg-dark-850 rounded-md" />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-dark-800">
              <div className="w-20 h-3 bg-dark-800 rounded-md" />
              <div className="w-16 h-6 bg-dark-800 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ReviewSkeleton;
