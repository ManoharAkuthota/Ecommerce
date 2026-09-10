/**
 * Infinite Marquee Hook
 * Module: hooks/useInfiniteMarquee.js
 * 
 * Reusable hook managing continuous marquee states, pause on hover/focus,
 * and touch-aware pause controls.
 */

import { useState, useCallback } from 'react';

export const useInfiniteMarquee = (options = {}) => {
  const { pauseOnHover = true } = options;
  const [isPaused, setIsPaused] = useState(false);

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) setIsPaused(true);
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) setIsPaused(false);
  }, [pauseOnHover]);

  const handleFocus = useCallback(() => {
    if (pauseOnHover) setIsPaused(true);
  }, [pauseOnHover]);

  const handleBlur = useCallback(() => {
    if (pauseOnHover) setIsPaused(false);
  }, [pauseOnHover]);

  return {
    isPaused,
    setIsPaused,
    containerProps: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onFocus: handleFocus,
      onBlur: handleBlur,
    },
  };
};

export default useInfiniteMarquee;
