// src/hooks/useMutation.js
import { useState, useCallback } from 'react';
import { request, ApiError } from '../services/api';

/**
 * Hook for executing write operations (POST, PUT, PATCH, DELETE).
 * 
 * @param {string|Function} urlOrFn - Endpoint URL or async function
 * @param {Object} options - Configuration options
 * @param {string} [options.method='POST'] - HTTP method
 * @param {Function} [options.onSuccess] - Callback when mutation succeeds
 * @param {Function} [options.onError] - Callback when mutation fails
 */
export function useMutation(urlOrFn, options = {}) {
  const {
    method = 'POST',
    onSuccess,
    onError,
  } = options;

  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const mutate = useCallback(
    async (variables, mutationOptions = {}) => {
      setSubmitting(true);
      setError(null);
      setIsSuccess(false);

      try {
        let result;
        if (typeof urlOrFn === 'function') {
          result = await urlOrFn(variables);
        } else {
          const reqMethod = mutationOptions.method || method;
          const isMultipart = variables instanceof FormData;
          result = await request(urlOrFn, {
            method: reqMethod,
            body: variables,
            isMultipart,
            ...mutationOptions,
          });
        }

        setData(result);
        setIsSuccess(true);
        setSubmitting(false);

        if (mutationOptions.onSuccess) {
          mutationOptions.onSuccess(result);
        } else if (onSuccess) {
          onSuccess(result);
        }

        return result;
      } catch (err) {
        const normalizedErr = err instanceof ApiError ? err : new ApiError({
          status: 0,
          message: err.message || 'Operation failed.',
          raw: err,
        });

        setError(normalizedErr);
        setIsSuccess(false);
        setSubmitting(false);

        if (mutationOptions.onError) {
          mutationOptions.onError(normalizedErr);
        } else if (onError) {
          onError(normalizedErr);
        }

        throw normalizedErr;
      }
    },
    [urlOrFn, method, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsSuccess(false);
    setSubmitting(false);
  }, []);

  return {
    mutate,
    submitting,
    data,
    error,
    isSuccess,
    isError: Boolean(error),
    reset,
  };
}

export default useMutation;
