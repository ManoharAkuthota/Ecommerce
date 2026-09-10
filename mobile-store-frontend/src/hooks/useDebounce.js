/**
 * useDebounce Hook
 * Module: hooks/useDebounce.js
 * 
 * Debounces any fast-changing value (e.g. search input text) by a specified delay.
 * Default delay: 300ms.
 */

import { useState, useEffect } from 'react';

export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
