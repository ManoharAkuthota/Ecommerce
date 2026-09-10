/**
 * Review Mobile Card Component
 * Module: components/admin/ReviewCard.jsx
 * 
 * Responsive card rendering for mobile & tablet screens (<1024px):
 * - Customer avatar & verified badge
 * - Purchased device badge
 * - Star rating
 * - Expandable review text
 * - Formatted date
 * - Delete action button
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Smartphone, ChevronDown, ChevronUp } from 'lucide-react';
import StarRating from './StarRating';

const AVATAR_GRADIENTS = [
  'from-indigo-600 to-purple-600 border-indigo-500/40',
  'from-emerald-600 to-teal-600 border-emerald-500/40',
  'from-amber-600 to-orange-600 border-amber-500/40',
  'from-rose-600 to-pink-600 border-rose-500/40',
  'from-cyan-600 to-blue-600 border-cyan-500/40',
  'from-violet-600 to-indigo-600 border-violet-500/40',
];

const getAvatarGradient = (name = '') => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[index];
};

const getInitials = (name = '') => {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const formatDate = (dateString) => {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
};

export const ReviewCard = ({
  review,
  onDelete,
  disabled = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!review) return null;

  const gradientClass = getAvatarGradient(review.customerName);
  const isLongText = (review.reviewText || '').length > 90;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="p-4 sm:p-5 rounded-2xl bg-dark-900/80 border border-dark-800 hover:border-dark-700/90 shadow-card space-y-3.5 transition-all"
    >
      {/* Header: Avatar, Name & Rating */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {review.customerImage && !imgError ? (
            <img
              src={review.customerImage}
              alt={review.customerName}
              onError={() => setImgError(true)}
              className="w-10 h-10 rounded-full object-cover border border-dark-700 shadow-sm flex-shrink-0"
              loading="lazy"
            />
          ) : (
            <div
              className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradientClass} text-white font-bold text-xs flex items-center justify-center border shadow-sm flex-shrink-0 select-none`}
            >
              {getInitials(review.customerName)}
            </div>
          )}

          <div className="flex flex-col">
            <span className="text-sm font-bold text-white tracking-tight">
              {review.customerName || 'Anonymous Customer'}
            </span>
            <span className="text-[11px] text-neutral-500 font-sans">
              Verified Buyer
            </span>
          </div>
        </div>

        <StarRating rating={review.rating || 5} size="xs" showScore={true} />
      </div>

      {/* Purchased Device Badge */}
      {review.purchasedPhone && (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-dark-950 border border-dark-800 text-[11px] font-semibold text-neutral-300">
          <Smartphone className="w-3.5 h-3.5 text-accent-400 flex-shrink-0" />
          <span className="truncate max-w-[240px]">
            {review.purchasedPhone}
          </span>
        </div>
      )}

      {/* Review Text */}
      <div className="text-xs text-neutral-300 leading-relaxed font-sans bg-dark-950/50 p-3 rounded-xl border border-dark-800/80">
        <p className={isExpanded ? '' : 'line-clamp-2'}>
          "{review.reviewText}"
        </p>

        {isLongText && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 text-[11px] text-accent-400 hover:text-accent-300 font-semibold mt-1 focus:outline-none"
          >
            {isExpanded ? (
              <>
                <span>Show less</span>
                <ChevronUp className="w-3 h-3" />
              </>
            ) : (
              <>
                <span>Read full review</span>
                <ChevronDown className="w-3 h-3" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Footer: Date & Delete Button */}
      <div className="flex items-center justify-between pt-2 border-t border-dark-800/80">
        <span className="text-xs text-neutral-400 font-mono">
          {formatDate(review.createdAt)}
        </span>

        <button
          type="button"
          onClick={() => onDelete(review)}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-500/20 border border-rose-500/30 transition-all focus:outline-none"
          aria-label={`Delete review from ${review.customerName}`}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete</span>
        </button>
      </div>
    </motion.div>
  );
};

export default ReviewCard;
