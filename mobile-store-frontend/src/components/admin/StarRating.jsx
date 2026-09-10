/**
 * Reusable Star Rating Component
 * Module: components/admin/StarRating.jsx
 * 
 * Displays 1 to 5 star rating with glowing amber styling,
 * customizable sizing, and optional numeric score badge.
 */

import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const SIZE_CONFIGS = {
  xs: {
    star: 'w-3 h-3',
    text: 'text-[10px]',
    gap: 'gap-0.5',
  },
  sm: {
    star: 'w-3.5 h-3.5',
    text: 'text-xs',
    gap: 'gap-1',
  },
  md: {
    star: 'w-4 h-4',
    text: 'text-xs sm:text-sm',
    gap: 'gap-1',
  },
  lg: {
    star: 'w-5 h-5',
    text: 'text-sm sm:text-base',
    gap: 'gap-1.5',
  },
};

export const StarRating = ({
  rating = 5,
  maxStars = 5,
  size = 'sm',
  showScore = false,
  className = '',
}) => {
  const currentSize = SIZE_CONFIGS[size] || SIZE_CONFIGS.sm;
  const clampedRating = Math.max(0, Math.min(maxStars, Number(rating) || 0));

  return (
    <div className={`inline-flex items-center ${currentSize.gap} select-none ${className}`}>
      <div className={`flex items-center ${currentSize.gap}`}>
        {Array.from({ length: maxStars }, (_, index) => {
          const starNumber = index + 1;
          const isFilled = starNumber <= Math.round(clampedRating);

          return (
            <motion.div
              key={index}
              whileHover={{ scale: 1.15 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="relative"
            >
              <Star
                className={`${currentSize.star} transition-colors duration-150 ${
                  isFilled
                    ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]'
                    : 'text-dark-700 fill-transparent'
                }`}
              />
            </motion.div>
          );
        })}
      </div>

      {showScore && (
        <span className={`font-mono font-bold text-amber-400 ${currentSize.text} ml-1`}>
          {Number(clampedRating).toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
