/**
 * Review Management Dashboard Page
 * Module: pages/admin/ReviewManagement.jsx
 * 
 * Enterprise review moderation console:
 * - Direct REST integration with Spring Boot review APIs
 * - Live client-side debounced search and star rating filter
 * - Server and client pagination support
 * - Optimistic deletion flow with ReviewDeleteModal
 * - Floating feedback toast notifications
 * - Responsive desktop table and mobile cards
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Star,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { Button, Card } from '../../components/ui';
import ReviewSearchBar from '../../components/admin/ReviewSearchBar';
import RatingFilter from '../../components/admin/RatingFilter';
import ReviewTable from '../../components/admin/ReviewTable';
import ReviewDeleteModal from '../../components/admin/ReviewDeleteModal';
import { reviewService } from '../../services/reviewService';

const ITEMS_PER_PAGE = 8;

export const ReviewManagement = () => {
  // Data State
  const [allReviews, setAllReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  // Deletion Modal State
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    review: null,
    isDeleting: false,
  });

  // Feedback Toasts
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: string }

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  /**
   * Load All Reviews and Average Metrics from Backend
   */
  const loadReviewsData = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    setLoadError(null);

    try {
      // Parallel fetch for reviews and metrics
      const [reviewsData, avgData] = await Promise.all([
        reviewService.getAllReviews(),
        reviewService.getAverageRating().catch(() => null),
      ]);

      const reviewsList = Array.isArray(reviewsData)
        ? reviewsData
        : reviewsData?.content || [];

      setAllReviews(reviewsList);

      if (avgData?.averageRating !== undefined && avgData?.averageRating !== null) {
        setAverageRating(Number(avgData.averageRating).toFixed(1));
      } else if (reviewsList.length > 0) {
        const sum = reviewsList.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
        setAverageRating((sum / reviewsList.length).toFixed(1));
      }
    } catch (err) {
      if (import.meta?.env?.DEV) {
        console.error('[ReviewManagement] Fetch error:', err);
      }
      setLoadError(
        err?.response?.data?.message ||
          'Failed to load customer reviews from server. Please verify your connection.'
      );
    } finally {
      if (!isSilent) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReviewsData();
  }, [loadReviewsData]);

  // Reset pagination when search query or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, ratingFilter]);

  /**
   * Client-Side Search and Rating Filtering
   */
  const filteredReviews = useMemo(() => {
    let result = [...allReviews];

    // Filter by Rating
    if (ratingFilter !== 'ALL') {
      const targetRating = parseInt(ratingFilter, 10);
      result = result.filter((r) => Math.round(Number(r.rating)) === targetRating);
    }

    // Filter by Search Query (Customer Name or Purchased Phone)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((r) => {
        const nameMatch = (r.customerName || '').toLowerCase().includes(q);
        const phoneMatch = (r.purchasedPhone || '').toLowerCase().includes(q);
        const textMatch = (r.reviewText || '').toLowerCase().includes(q);
        return nameMatch || phoneMatch || textMatch;
      });
    }

    return result;
  }, [allReviews, searchQuery, ratingFilter]);

  /**
   * Pagination Slicing
   */
  const totalItems = filteredReviews.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);

  const paginatedReviews = useMemo(() => {
    return filteredReviews.slice(startIndex, endIndex);
  }, [filteredReviews, startIndex, endIndex]);

  const isFiltered = Boolean(searchQuery.trim() || ratingFilter !== 'ALL');

  const handleResetFilters = () => {
    setSearchQuery('');
    setRatingFilter('ALL');
    setCurrentPage(1);
  };

  /**
   * Open Deletion Confirmation Dialog
   */
  const handleOpenDeleteModal = (review) => {
    setDeleteModal({
      isOpen: true,
      review,
      isDeleting: false,
    });
  };

  /**
   * Confirm and Execute Review Deletion
   */
  const handleConfirmDelete = async (reviewId) => {
    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));

    // Capture snapshot for optimistic rollback
    const previousReviews = [...allReviews];
    const targetReview = deleteModal.review;

    // Optimistic local removal
    setAllReviews((prev) => prev.filter((r) => r.id !== reviewId));

    try {
      await reviewService.deleteReview(reviewId);

      setDeleteModal({ isOpen: false, review: null, isDeleting: false });
      showToast(`Review by "${targetReview?.customerName || 'Customer'}" deleted successfully.`);

      // Refresh data silently to sync pagination and average rating
      loadReviewsData(true);
    } catch (err) {
      // Rollback state on error
      setAllReviews(previousReviews);
      setDeleteModal({ isOpen: false, review: null, isDeleting: false });

      const errorMsg =
        err?.response?.data?.message || 'Failed to delete review. Please try again.';
      showToast(errorMsg, 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-dark-800/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <span>Review Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Manage customer testimonials displayed across the MS Mobiles website.
          </p>
        </div>

        {/* Header Badges: Total Count & Average Rating */}
        <div className="flex items-center gap-2.5">
          {averageRating && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-300 shadow-glow-sm">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold font-mono">{averageRating}</span>
              <span className="text-[10px] text-amber-400/80 uppercase font-sans">Avg</span>
            </div>
          )}

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-dark-900/90 border border-dark-700/80 text-neutral-300 text-xs font-bold shadow-inner">
            <MessageSquare className="w-3.5 h-3.5 text-accent-400" />
            <span>
              {allReviews.length} {allReviews.length === 1 ? 'Review' : 'Reviews'}
            </span>
          </div>
        </div>
      </div>

      {/* Floating Feedback Toast Banner */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`p-4 rounded-2xl border flex items-center justify-between gap-3 shadow-2xl ${
              toast.type === 'error'
                ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
            }`}
          >
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium">
              {toast.type === 'error' ? (
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              ) : (
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              )}
              <span>{toast.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="p-1 rounded-lg text-neutral-400 hover:text-white"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Server Error Alert Banner */}
      {loadError && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5 text-xs sm:text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400 mt-0.5" />
            <div>
              <p className="font-bold text-white">Error Loading Reviews</p>
              <p className="text-rose-300/90 mt-0.5">{loadError}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadReviewsData()}
            className="text-xs border-rose-500/30 text-rose-200"
          >
            Retry
          </Button>
        </div>
      )}

      {/* 2. Controls Bar: Search & Rating Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex-1 max-w-lg">
          <ReviewSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            isLoading={false}
          />
        </div>

        <div className="flex items-center gap-2.5">
          <RatingFilter
            value={ratingFilter}
            onChange={setRatingFilter}
          />

          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => {
              loadReviewsData();
              showToast('Reviews refreshed from server.');
            }}
            disabled={isLoading}
            iconLeft={<RotateCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />}
            className="border-dark-700 hover:border-dark-600 text-neutral-300"
            title="Refresh reviews"
            aria-label="Refresh reviews"
          />
        </div>
      </div>

      {/* 3. Review Table & Mobile Cards */}
      <ReviewTable
        reviews={paginatedReviews}
        isLoading={isLoading}
        isFiltered={isFiltered}
        onResetFilters={handleResetFilters}
        onRefresh={loadReviewsData}
        onDeleteReview={handleOpenDeleteModal}
        isDeletingId={deleteModal.isDeleting ? deleteModal.review?.id : null}
      />

      {/* 4. Pagination Controls Footer */}
      {!isLoading && filteredReviews.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {/* Item Count Range */}
          <span className="text-xs text-neutral-400 font-sans">
            Showing <strong className="text-white font-mono">{startIndex + 1}</strong> to{' '}
            <strong className="text-white font-mono">{endIndex}</strong> of{' '}
            <strong className="text-white font-mono">{totalItems}</strong> reviews
          </span>

          {/* Previous / Page / Next Buttons */}
          <div className="flex items-center gap-2 select-none">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              iconLeft={<ChevronLeft className="w-4 h-4" />}
              className="text-xs border-dark-700 hover:border-dark-600 disabled:opacity-40"
              aria-label="Previous page"
            >
              Previous
            </Button>

            <span className="px-3 py-1.5 rounded-xl bg-dark-900 border border-dark-700/80 text-xs font-mono text-neutral-300">
              Page <span className="font-bold text-white">{currentPage}</span> of{' '}
              <span className="font-bold text-white">{totalPages}</span>
            </span>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              iconRight={<ChevronRight className="w-4 h-4" />}
              className="text-xs border-dark-700 hover:border-dark-600 disabled:opacity-40"
              aria-label="Next page"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* 5. Delete Confirmation Modal */}
      <ReviewDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, review: null, isDeleting: false })}
        onConfirm={handleConfirmDelete}
        review={deleteModal.review}
        isDeleting={deleteModal.isDeleting}
      />
    </div>
  );
};

export default ReviewManagement;
