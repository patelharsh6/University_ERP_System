// src/hooks/useDebounce.js
import { useState, useEffect } from 'react';

/**
 * Hook to debounce any fast-changing value (e.g. search input).
 * 
 * @param {*} value - Value to debounce
 * @param {number} [delay=300] - Delay in milliseconds
 * @returns {*} Debounced value
 */
export function useDebounce(value, delay = 300) {
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
}

export default useDebounce;
