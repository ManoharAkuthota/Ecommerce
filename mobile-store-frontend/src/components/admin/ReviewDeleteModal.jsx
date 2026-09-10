/**
 * Review Deletion Confirmation Modal Component
 * Module: components/admin/ReviewDeleteModal.jsx
 * 
 * Luxury confirmation modal before permanently removing a customer review.
 * Displays reviewer avatar, name, purchased mobile, star rating, and review text snippet.
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X, Smartphone, User } from 'lucide-react';
import { Card, Button } from '../ui';
import StarRating from './StarRating';

export const ReviewDeleteModal = ({
  isOpen = false,
  onClose,
  onConfirm,
  review = null,
  isDeleting = false,
}) => {
  // Listen for Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isDeleting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (!review) return null;

  // Initials generator
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={!isDeleting ? onClose : undefined}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Dialog Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="relative w-full max-w-lg z-10"
          >
            <Card
              glass={true}
              className="p-6 sm:p-7 border-rose-500/25 bg-dark-900/95 shadow-2xl relative overflow-hidden"
            >
              {/* Top Danger Glow */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                disabled={isDeleting}
                className="absolute top-4 right-4 p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-dark-800 transition-colors disabled:opacity-50"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-5">
                {/* Header Icon & Title */}
                <div className="flex items-start gap-3.5">
                  <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex-shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      Delete Customer Review
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      This action will permanently delete this testimonial from the storefront and database.
                    </p>
                  </div>
                </div>

                {/* Review Details Preview Box */}
                <div className="p-4 rounded-2xl bg-dark-950/80 border border-dark-800 space-y-3">
                  {/* Customer Info & Rating */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      {review.customerImage ? (
                        <img
                          src={review.customerImage}
                          alt={review.customerName}
                          className="w-8 h-8 rounded-full object-cover border border-dark-700"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-600 to-indigo-700 text-white font-bold text-xs flex items-center justify-center border border-accent-500/40">
                          {getInitials(review.customerName)}
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-bold text-white">
                          {review.customerName || 'Anonymous Customer'}
                        </p>
                        {review.purchasedPhone && (
                          <div className="flex items-center gap-1 text-[11px] text-neutral-400">
                            <Smartphone className="w-3 h-3 text-neutral-500" />
                            <span className="truncate max-w-[180px]">
                              {review.purchasedPhone}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <StarRating rating={review.rating || 5} size="xs" showScore={true} />
                  </div>

                  {/* Review Excerpt */}
                  {review.reviewText && (
                    <p className="text-xs text-neutral-300 italic bg-dark-900/60 p-2.5 rounded-xl border border-dark-800/80 line-clamp-3 leading-relaxed">
                      "{review.reviewText}"
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onClose}
                    disabled={isDeleting}
                    className="border-dark-700 hover:border-dark-600 text-neutral-300 text-xs"
                  >
                    Cancel
                  </Button>

                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => onConfirm(review.id)}
                    disabled={isDeleting}
                    isLoading={isDeleting}
                    iconLeft={!isDeleting ? <Trash2 className="w-3.5 h-3.5" /> : null}
                    className="text-xs shadow-glow-sm"
                  >
                    {isDeleting ? 'Deleting Review...' : 'Delete Review'}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ReviewDeleteModal;
