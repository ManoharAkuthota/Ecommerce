/**
 * ReviewCard Component
 * Module: components/home/ReviewCard.jsx
 *
 * Glassmorphic customer testimonial card for the public homepage marquee:
 * - Customer image or styled initials avatar
 * - Customer name & verified buyer badge
 * - Purchased device tag
 * - Star rating (1-5 filled amber stars)
 * - Review quote text
 * - Shimmer skeleton state (ReviewSkeleton)
 */

import React, { useState } from 'react';
import { Star, CheckCircle2, Quote, Smartphone, User } from 'lucide-react';

export const StarRating = ({ rating = 5, maxStars = 5, size = 'w-3.5 h-3.5' }) => {
  const safeRating = Math.max(1, Math.min(maxStars, Number(rating) || 5));

  return (
    <div
      className="flex items-center gap-0.5"
      role="img"
      aria-label={`${safeRating} out of ${maxStars} stars`}
    >
      {Array.from({ length: maxStars }).map((_, index) => {
        const isFilled = index < safeRating;
        return (
          <Star
            key={index}
            className={`${size} ${
              isFilled
                ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.4)]'
                : 'text-dark-700 fill-dark-800'
            }`}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
};

export const ReviewCard = ({ review }) => {
  const [imageError, setImageError] = useState(false);

  if (!review) return null;

  const {
    customerName = 'Verified Buyer',
    customerImage,
    rating = 5,
    purchasedPhone,
    reviewText = '',
    createdAt,
  } = review;

  // Derive 2-letter initials for avatar fallback
  const initials = customerName
    ? customerName
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'VB';

  // Format date if provided
  let formattedDate = '';
  if (createdAt) {
    try {
      formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });
    } catch (e) {
      formattedDate = '';
    }
  }

  return (
    <article className="group relative flex flex-col justify-between w-[300px] sm:w-[360px] md:w-[400px] shrink-0 p-6 sm:p-7 rounded-3xl bg-dark-900/60 hover:bg-dark-900/95 border border-dark-800/80 hover:border-accent-500/40 backdrop-blur-xl shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 select-none cursor-default">
      {/* Decorative ambient corner glow on hover */}
      <div className="absolute top-0 right-0 -mr-4 -mt-4 w-28 h-28 bg-accent-500/0 group-hover:bg-accent-500/10 rounded-full blur-2xl transition-all duration-500 pointer-events-none -z-10" />

      {/* Decorative Quote Icon in Header */}
      <Quote
        className="absolute top-6 right-6 w-7 h-7 text-dark-800/50 group-hover:text-accent-500/20 transition-colors pointer-events-none"
        aria-hidden="true"
      />

      <div>
        {/* Star Rating & Purchased Phone Tag */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pr-6">
          <StarRating rating={rating} />
          {purchasedPhone && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-dark-850 border border-dark-750 text-[11px] font-medium text-neutral-300 group-hover:border-accent-500/30 group-hover:text-accent-300 transition-colors">
              <Smartphone className="w-3 h-3 text-accent-400 shrink-0" />
              <span className="truncate max-w-[140px] sm:max-w-[160px]">{purchasedPhone}</span>
            </div>
          )}
        </div>

        {/* Review Quote Text */}
        <p className="text-sm leading-relaxed text-neutral-300 group-hover:text-neutral-200 transition-colors line-clamp-4">
          "{reviewText || 'Exceptional experience with MS Mobiles. Delivered on time with genuine brand warranty.'}"
        </p>
      </div>

      {/* Customer Avatar & Details Footer */}
      <div className="flex items-center gap-3.5 pt-5 mt-5 border-t border-dark-800/70">
        {/* Circular Avatar */}
        <div className="relative w-10 h-10 rounded-full p-[1px] bg-gradient-to-tr from-dark-700 via-dark-800 to-accent-500/40 group-hover:to-accent-500 transition-colors shrink-0">
          <div className="w-full h-full rounded-full overflow-hidden bg-dark-850 flex items-center justify-center">
            {customerImage && !imageError ? (
              <img
                src={customerImage}
                alt={customerName}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <span className="text-xs font-mono font-bold text-accent-300">
                {initials}
              </span>
            )}
          </div>
        </div>

        {/* Customer Name & Verified Purchaser Badge */}
        <div className="flex flex-col text-left overflow-hidden">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-white group-hover:text-accent-300 transition-colors truncate">
              {customerName}
            </span>
            <CheckCircle2
              className="w-3.5 h-3.5 text-accent-400 shrink-0"
              title="Verified Buyer"
              aria-label="Verified Buyer"
            />
          </div>
          <span className="text-[11px] text-neutral-400">
            Verified Customer {formattedDate ? `• ${formattedDate}` : ''}
          </span>
        </div>
      </div>
    </article>
  );
};

export const ReviewSkeleton = () => {
  return (
    <div className="flex flex-col justify-between w-[300px] sm:w-[360px] md:w-[400px] shrink-0 p-6 sm:p-7 rounded-3xl bg-dark-900/40 border border-dark-800/60 space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="w-24 h-4 bg-dark-800 rounded" />
        <div className="w-28 h-5 bg-dark-800 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="w-full h-3.5 bg-dark-800 rounded" />
        <div className="w-5/6 h-3.5 bg-dark-800 rounded" />
        <div className="w-3/4 h-3.5 bg-dark-800 rounded" />
      </div>
      <div className="pt-4 border-t border-dark-800 flex items-center gap-3">
        <div className="w-10 h-10 bg-dark-800 rounded-full" />
        <div className="space-y-1.5">
          <div className="w-24 h-3.5 bg-dark-800 rounded" />
          <div className="w-16 h-2.5 bg-dark-800 rounded" />
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
