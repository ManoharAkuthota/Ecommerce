/**
 * Review Table Row Component (Desktop)
 * Module: components/admin/ReviewTableRow.jsx
 * 
 * Desktop table row rendering:
 * 1. Customer avatar (photo or initials) + name
 * 2. Purchased smartphone badge with tooltip
 * 3. StarRating score
 * 4. Two-line clamped review with expand/collapse toggle
 * 5. Human-friendly created date
 * 6. Action triggers (Delete Review)
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Smartphone, ChevronDown, ChevronUp, User } from 'lucide-react';
import StarRating from './StarRating';

// Deterministic gradient generator for initials avatars
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
    }); // e.g. "2 Sep 2026"
  } catch {
    return '—';
  }
};

export const ReviewTableRow = ({
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
    <motion.tr
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="group hover:bg-dark-850/50 transition-colors border-b border-dark-800/80 last:border-0"
    >
      {/* 1. Customer Column */}
      <td className="py-4 px-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          {review.customerImage && !imgError ? (
            <img
              src={review.customerImage}
              alt={review.customerName}
              onError={() => setImgError(true)}
              className="w-9 h-9 rounded-full object-cover border border-dark-700 shadow-sm"
              loading="lazy"
            />
          ) : (
            <div
              className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradientClass} text-white font-bold text-xs flex items-center justify-center border shadow-sm select-none`}
            >
              {getInitials(review.customerName)}
            </div>
          )}

          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-bold text-white tracking-tight group-hover:text-accent-300 transition-colors">
              {review.customerName || 'Anonymous Customer'}
            </span>
            <span className="text-[11px] text-neutral-500 font-sans">
              Verified Buyer
            </span>
          </div>
        </div>
      </td>

      {/* 2. Purchased Phone Column */}
      <td className="py-4 px-4">
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-dark-900 border border-dark-700/80 max-w-[200px]"
          title={review.purchasedPhone || 'Purchased Device'}
        >
          <Smartphone className="w-3.5 h-3.5 text-accent-400 flex-shrink-0" />
          <span className="text-xs font-semibold text-neutral-300 truncate">
            {review.purchasedPhone || 'Flagship Smartphone'}
          </span>
        </div>
      </td>

      {/* 3. Rating Column */}
      <td className="py-4 px-4 whitespace-nowrap">
        <StarRating rating={review.rating || 5} size="sm" showScore={true} />
      </td>

      {/* 4. Review Text Column */}
      <td className="py-4 px-4">
        <div className="max-w-md">
          <p
            className={`text-xs text-neutral-300 leading-relaxed font-sans ${
              isExpanded ? '' : 'line-clamp-2'
            }`}
          >
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
      </td>

      {/* 5. Date Column */}
      <td className="py-4 px-4 whitespace-nowrap text-xs text-neutral-400 font-mono">
        {formatDate(review.createdAt)}
      </td>

      {/* 6. Actions Column */}
      <td className="py-4 px-4 text-right whitespace-nowrap">
        <button
          type="button"
          onClick={() => onDelete(review)}
          disabled={disabled}
          className="p-2 rounded-xl text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-rose-500/30"
          title="Delete review"
          aria-label={`Delete review from ${review.customerName}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </td>
    </motion.tr>
  );
};

export default ReviewTableRow;
