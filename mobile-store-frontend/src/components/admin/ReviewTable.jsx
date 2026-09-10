/**
 * Review Table & Cards Container Component
 * Module: components/admin/ReviewTable.jsx
 * 
 * Responsive container orchestrating:
 * - Desktop semantic 6-column table (>=1024px)
 * - Mobile responsive review cards (<1024px)
 * - Loading skeleton states
 * - Empty search/filter states
 */

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import ReviewTableRow from './ReviewTableRow';
import ReviewCard from './ReviewCard';
import ReviewSkeleton from './ReviewSkeleton';
import ReviewEmptyState from './ReviewEmptyState';
import { Card } from '../ui';

export const ReviewTable = ({
  reviews = [],
  isLoading = false,
  isFiltered = false,
  onResetFilters,
  onRefresh,
  onDeleteReview,
  isDeletingId = null,
}) => {
  // Loading State
  if (isLoading) {
    return (
      <div className="rounded-3xl border border-dark-800 bg-dark-900/60 overflow-hidden shadow-card backdrop-blur-xl">
        <table className="hidden lg:table w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-dark-800 bg-dark-950/60 text-[11px] font-bold text-neutral-400 uppercase tracking-wider select-none">
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Purchased Phone</th>
              <th className="py-3.5 px-4">Rating</th>
              <th className="py-3.5 px-4">Review</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <ReviewSkeleton rows={5} />
        </table>
        <div className="lg:hidden">
          <ReviewSkeleton rows={3} />
        </div>
      </div>
    );
  }

  // Empty State
  if (!reviews || reviews.length === 0) {
    return (
      <ReviewEmptyState
        isFiltered={isFiltered}
        onResetFilters={onResetFilters}
        onRefresh={onRefresh}
      />
    );
  }

  return (
    <div className="rounded-3xl border border-dark-800 bg-dark-900/60 overflow-hidden shadow-card backdrop-blur-xl">
      {/* 1. Desktop Semantic Table View (>=1024px) */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-dark-800 bg-dark-950/70 text-[11px] font-bold text-neutral-400 uppercase tracking-wider select-none">
              <th scope="col" className="py-3.5 px-4">
                Customer
              </th>
              <th scope="col" className="py-3.5 px-4">
                Purchased Phone
              </th>
              <th scope="col" className="py-3.5 px-4">
                Rating
              </th>
              <th scope="col" className="py-3.5 px-4">
                Review Text
              </th>
              <th scope="col" className="py-3.5 px-4">
                Date
              </th>
              <th scope="col" className="py-3.5 px-4 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-800/80">
            <AnimatePresence mode="popLayout">
              {reviews.map((review) => (
                <ReviewTableRow
                  key={review.id}
                  review={review}
                  onDelete={onDeleteReview}
                  disabled={isDeletingId === review.id}
                />
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* 2. Mobile Responsive Card List (<1024px) */}
      <div className="lg:hidden p-4 space-y-3.5">
        <AnimatePresence mode="popLayout">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onDelete={onDeleteReview}
              disabled={isDeletingId === review.id}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ReviewTable;
