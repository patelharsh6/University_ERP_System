// src/hooks/useFilters.js
import { useState, useCallback } from 'react';

/**
 * Hook for managing UI filters with reset and update capabilities.
 * 
 * @param {Object} initialFilters - Initial key-value filter object
 */
export function useFilters(initialFilters = {}) {
  const [filters, setFilters] = useState(initialFilters);

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => {
      if (prev[key] === value) return prev;
      return {
        ...prev,
        [key]: value,
      };
    });
  }, []);

  const setMultipleFilters = useCallback((newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const clearFilter = useCallback((key) => {
    setFilters((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  return {
    filters,
    setFilter,
    setMultipleFilters,
    resetFilters,
    clearFilter,
    setFilters,
  };
}

export default useFilters;
