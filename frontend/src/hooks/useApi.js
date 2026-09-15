// src/hooks/useApi.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { request } from '../services/api';

/**
 * Hook for declarative GET requests.
 * 
 * @param {string|Function} urlOrFn - Endpoint URL string or factory function
 * @param {Object} options - Configuration options
 * @param {Object} [options.params] - Query parameters
 * @param {boolean} [options.skip=false] - Skip fetching conditionally
 * @param {*} [options.initialData=null] - Initial data value
 * @param {Function} [options.transform] - Transformation callback on received data
 * @param {Function} [options.onSuccess] - Callback on success
 * @param {Function} [options.onError] - Callback on error
 */
export function useApi(urlOrFn, options = {}) {
  const {
    params,
    skip = false,
    initialData = null,
    transform,
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState(null);

  const abortControllerRef = useRef(null);
  const paramsKey = JSON.stringify(params || {});
  const url = typeof urlOrFn === 'function' ? urlOrFn(params) : urlOrFn;

  const fetchData = useCallback(async (overrideParams) => {
    if (skip || !url) {
      setLoading(false);
      return;
    }

    // Cancel in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const mergedParams = overrideParams !== undefined ? overrideParams : params;
      const res = await request(url, {
        method: 'GET',
        params: mergedParams,
        signal: abortControllerRef.current.signal,
      });

      const processedData = transform ? transform(res) : res;
      setData(processedData);
      setLoading(false);
      if (onSuccess) onSuccess(processedData);
      return processedData;
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError(err);
      setLoading(false);
      if (onError) onError(err);
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, skip, paramsKey]);

  useEffect(() => {
    fetchData();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  const refetch = useCallback((overrideParams) => {
    return fetchData(overrideParams);
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
    setData,
  };
}

export default useApi;
