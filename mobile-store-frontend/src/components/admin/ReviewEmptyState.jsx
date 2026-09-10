/**
 * Review Empty State Component
 * Module: components/admin/ReviewEmptyState.jsx
 * 
 * Displays a luxury empty state illustration when no reviews match
 * active search filters or when the review store is empty.
 */

import React from 'react';
import { MessageSquare, RotateCcw, SearchX } from 'lucide-react';
import { Card, Button } from '../ui';

export const ReviewEmptyState = ({
  isFiltered = false,
  onResetFilters,
  onRefresh,
}) => {
  return (
    <Card
      glass={true}
      className="p-12 text-center border-dark-800 bg-dark-900/60 my-6 shadow-card"
    >
      <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-4">
        {/* Glowing Icon Circle */}
        <div className="relative">
          <div className="w-16 h-16 rounded-3xl bg-dark-800/80 border border-dark-700/80 flex items-center justify-center text-accent-400 shadow-inner">
            {isFiltered ? (
              <SearchX className="w-8 h-8 text-neutral-400" />
            ) : (
              <MessageSquare className="w-8 h-8 text-accent-400" />
            )}
          </div>
          <div className="absolute inset-0 bg-accent-500/10 rounded-3xl blur-xl -z-10" />
        </div>

        {/* Text Details */}
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white tracking-tight">
            {isFiltered ? 'No Matching Reviews Found' : 'No Customer Reviews Yet'}
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            {isFiltered
              ? 'Try modifying your search criteria or resetting the rating filter to see more testimonials.'
              : 'When customers share their feedback and ratings, their reviews will appear here for management.'}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {isFiltered ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              iconLeft={<RotateCcw className="w-3.5 h-3.5" />}
              className="text-xs border-dark-700 hover:border-dark-600 text-neutral-300"
            >
              Reset Filters
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              iconLeft={<RotateCcw className="w-3.5 h-3.5" />}
              className="text-xs border-dark-700 hover:border-dark-600 text-neutral-300"
            >
              Refresh Reviews
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ReviewEmptyState;
