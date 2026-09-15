// src/hooks/usePaginated.js
import { useState, useCallback, useEffect } from 'react';
import { useApi } from './useApi';
import { PAGINATION_DEFAULTS } from '../utils/constants';

/**
 * Hook for managing paginated DRF endpoints.
 * 
 * @param {string} endpoint - API endpoint
 * @param {Object} [options={}] - Options
 * @param {number} [options.pageSize=20] - Number of items per page
 * @param {number} [options.initialPage=1] - Starting page
 * @param {Object} [options.params={}] - Additional query filters
 */
export function usePaginated(endpoint, options = {}) {
  const {
    pageSize = PAGINATION_DEFAULTS.PAGE_SIZE,
    initialPage = 1,
    params = {},
    ...apiOptions
  } = options;

  const [page, setPage] = useState(initialPage);

  // Reset to page 1 if query filters change
  const filterKey = JSON.stringify(params);
  useEffect(() => {
    setPage(1);
  }, [filterKey]);

  const queryParams = {
    ...params,
    page,
    page_size: pageSize,
  };

  const { data, loading, error, refetch } = useApi(endpoint, {
    params: queryParams,
    ...apiOptions,
  });

  // Support both DRF Paginated format { count, next, previous, results } and raw arrays
  const items = Array.isArray(data) ? data : data?.results || [];
  const count = Array.isArray(data) ? data.length : data?.count || 0;
  const totalPages = Math.max(1, Math.ceil(count / pageSize));
  const hasNext = Boolean(data?.next) || page < totalPages;
  const hasPrev = Boolean(data?.previous) || page > 1;

  const goToPage = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  }, [totalPages]);

  const goToNext = useCallback(() => {
    if (hasNext) {
      setPage((prev) => prev + 1);
    }
  }, [hasNext]);

  const goToPrev = useCallback(() => {
    if (hasPrev) {
      setPage((prev) => Math.max(1, prev - 1));
    }
  }, [hasPrev]);

  return {
    items,
    count,
    page,
    pageSize,
    totalPages,
    hasNext,
    hasPrev,
    loading,
    error,
    setPage: goToPage,
    goToNext,
    goToPrev,
    refetch,
  };
}

export default usePaginated;
