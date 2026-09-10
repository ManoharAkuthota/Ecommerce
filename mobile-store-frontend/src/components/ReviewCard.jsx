import React, { useState } from 'react';
import { Star, CheckCircle2, Quote, Smartphone, User } from 'lucide-react';

/**
 * StarRating Component
 * Renders 5 stars with filled amber stars and muted empty stars.
 * High-contrast, accessible, and readable in both dark and light modes.
 */
export const StarRating = ({ rating = 5, maxStars = 5, size = 'w-4 h-4' }) => {
  return (
    <div
      className="flex items-center gap-1"
      role="img"
      aria-label={`${rating} out of ${maxStars} stars`}
    >
      {Array.from({ length: maxStars }).map((_, index) => {
        const isFilled = index < rating;
        return (
          <Star
            key={index}
            className={`${size} ${
              isFilled
                ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.35)]'
                : 'text-dark-700 fill-dark-800/60'
            } transition-colors`}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
};

/**
 * ReviewCard Component
 * Luxurious glassmorphic customer review card with hover lift, soft glow,
 * verified purchaser badge, customer avatar, and star rating.
 */
const ReviewCard = ({ review }) => {
  const [imageError, setImageError] = useState(false);

  if (!review) return null;

  const {
    customerName = 'Anonymous Customer',
    customerImage,
    city,
    rating = 5,
    purchasedPhone,
    reviewText = '',
    date,
    verified = true,
  } = review;

  // Extract initials as fallback for failed image load
  const initials = customerName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <article
      className="group relative flex flex-col justify-between w-[280px] sm:w-[340px] md:w-[380px] shrink-0 p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-dark-900/60 hover:bg-dark-900/90 border border-dark-800/80 hover:border-accent-500/40 backdrop-blur-xl shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 select-none cursor-default"
    >
      {/* Decorative ambient corner glow on hover */}
      <div className="absolute top-0 right-0 -mr-4 -mt-4 w-28 h-28 bg-accent-500/0 group-hover:bg-accent-500/10 rounded-full blur-2xl transition-all duration-500 pointer-events-none -z-10" />

      {/* Decorative subtle quotation mark in background */}
      <Quote
        className="absolute top-5 right-5 w-8 h-8 text-dark-800/40 group-hover:text-accent-500/20 transition-colors pointer-events-none"
        aria-hidden="true"
      />

      <div>
        {/* Rating & Purchased Phone Tag */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <StarRating rating={rating} />
          {purchasedPhone && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-dark-850/90 border border-dark-750 text-[11px] font-medium text-neutral-300 group-hover:border-accent-500/30 group-hover:text-accent-300 transition-colors">
              <Smartphone className="w-3 h-3 text-accent-400 shrink-0" />
              <span className="truncate max-w-[140px] sm:max-w-[160px]">{purchasedPhone}</span>
            </div>
          )}
        </div>

        {/* Review Text */}
        <p className="text-sm sm:text-[15px] leading-relaxed text-neutral-300 group-hover:text-neutral-200 transition-colors line-clamp-4">
          "{reviewText}"
        </p>
      </div>

      {/* Customer Info Header */}
      <div className="flex items-center gap-3.5 pt-5 mt-5 border-t border-dark-800/70">
        {/* Circular Avatar */}
        <div className="relative w-11 h-11 rounded-full p-[1.5px] bg-gradient-to-tr from-dark-700 via-dark-800 to-accent-500/40 group-hover:to-accent-500 transition-colors shrink-0">
          <div className="w-full h-full rounded-full overflow-hidden bg-dark-850 flex items-center justify-center">
            {customerImage && !imageError ? (
              <img
                src={customerImage}
                alt={`${customerName}'s profile photo`}
                loading="lazy"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs font-bold text-neutral-300 flex items-center justify-center">
                {initials || <User className="w-4 h-4 text-neutral-400" />}
              </span>
            )}
          </div>
          {verified && (
            <div
              className="absolute -bottom-0.5 -right-0.5 p-0.5 bg-dark-950 rounded-full text-emerald-400"
              title="Verified Buyer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-500 text-dark-950" />
            </div>
          )}
        </div>

        {/* Customer Details */}
        <div className="flex flex-col min-w-0 flex-1 text-left">
          <div className="flex items-center gap-1.5">
            <h4 className="text-sm font-bold text-white group-hover:text-accent-300 transition-colors truncate">
              {customerName}
            </h4>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-neutral-400">
            {city && <span>{city}</span>}
            {city && date && <span className="text-dark-600">•</span>}
            {date && <span>{date}</span>}
          </div>
        </div>
      </div>
    </article>
  );
};

/**
 * ReviewSkeleton Component
 * Reusable loading placeholder matching ReviewCard layout for future API data hydration.
 */
export const ReviewSkeleton = () => {
  return (
    <div className="flex flex-col justify-between w-[280px] sm:w-[340px] md:w-[380px] shrink-0 p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-dark-900/40 border border-dark-800/50 backdrop-blur-xl shadow-card animate-pulse">
      <div>
        {/* Rating & Tag Skeleton */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-4 h-4 rounded bg-dark-800" />
            ))}
          </div>
          <div className="w-24 h-5 rounded-full bg-dark-800" />
        </div>

        {/* Review Text Skeleton */}
        <div className="space-y-2 mt-2">
          <div className="w-full h-3.5 rounded bg-dark-800" />
          <div className="w-11/12 h-3.5 rounded bg-dark-800" />
          <div className="w-4/5 h-3.5 rounded bg-dark-800" />
          <div className="w-2/3 h-3.5 rounded bg-dark-800" />
        </div>
      </div>

      {/* Customer Info Skeleton */}
      <div className="flex items-center gap-3.5 pt-5 mt-5 border-t border-dark-800/60">
        <div className="w-11 h-11 rounded-full bg-dark-800 shrink-0" />
        <div className="space-y-1.5 flex-1">
          <div className="w-24 h-3.5 rounded bg-dark-800" />
          <div className="w-16 h-2.5 rounded bg-dark-850" />
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
