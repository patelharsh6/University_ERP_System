// src/services/api.js
import { STORAGE_KEYS } from '../utils/constants';

const BASE_URL = process.env.REACT_APP_API_URL || '';

/**
 * Standardized ApiError class capturing HTTP status, custom error code,
 * user-friendly message, and detailed field errors.
 */
export class ApiError extends Error {
  constructor({ status, code = 'unknown_error', message, fieldErrors = {}, raw = null }) {
    super(message || 'An unexpected error occurred.');
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
    this.raw = raw;
  }
}

// In-memory token cache with fallback to storage
let inMemoryAccessToken = null;

export const tokenStorage = {
  getAccessToken: () => {
    if (inMemoryAccessToken) return inMemoryAccessToken;
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) || sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },
  setAccessToken: (token, persist = true) => {
    inMemoryAccessToken = token;
    if (token) {
      if (persist) {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
      } else {
        sessionStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
      }
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    }
  },
  getRefreshToken: () => {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) || sessionStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },
  setRefreshToken: (token, persist = true) => {
    if (token) {
      if (persist) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
      } else {
        sessionStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
      }
    } else {
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      sessionStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    }
  },
  clearTokens: () => {
    inMemoryAccessToken = null;
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    sessionStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },
};

// Single-flight refresh token lock & request queue
let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed(newAccessToken, error = null) {
  refreshSubscribers.forEach((cb) => cb(newAccessToken, error));
  refreshSubscribers = [];
}

/**
 * Perform a single-flight token refresh.
 */
async function refreshAuthToken() {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) {
    throw new ApiError({
      status: 401,
      code: 'no_refresh_token',
      message: 'No refresh token available.',
    });
  }

  try {
    const response = await fetch(`${BASE_URL}/api/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      tokenStorage.clearTokens();
      window.dispatchEvent(new CustomEvent('auth:logout', { detail: { reason: 'session_expired' } }));
      throw new ApiError({
        status: response.status,
        code: 'refresh_failed',
        message: 'Session expired. Please log in again.',
      });
    }

    const data = await response.json();
    const newAccess = data.access || data.token;
    if (newAccess) {
      tokenStorage.setAccessToken(newAccess);
    }
    if (data.refresh) {
      tokenStorage.setRefreshToken(data.refresh);
    }
    return newAccess;
  } catch (err) {
    tokenStorage.clearTokens();
    window.dispatchEvent(new CustomEvent('auth:logout', { detail: { reason: 'session_expired' } }));
    throw err;
  }
}

/**
 * Build URL with serialized query parameters.
 */
export function buildUrl(path, params = {}) {
  const url = path.startsWith('http') ? new URL(path) : new URL(`${BASE_URL}${path}`, window.location.origin);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach((v) => url.searchParams.append(key, v));
      } else {
        url.searchParams.append(key, String(value));
      }
    }
  });

  return path.startsWith('http') ? url.toString() : `${url.pathname}${url.search}`;
}

/**
 * Core request function. Handles headers, auth token attachment, single-flight refresh,
 * error normalization, and abort signals.
 */
export async function request(path, options = {}) {
  const {
    method = 'GET',
    params,
    body,
    headers = {},
    signal,
    isMultipart = false,
    skipAuth = false,
    _retry = false,
  } = options;

  const url = buildUrl(path, params);
  const reqHeaders = { ...headers };

  // Set auth header
  if (!skipAuth) {
    const token = tokenStorage.getAccessToken();
    if (token && !reqHeaders['Authorization']) {
      reqHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  // Set Content-Type unless multipart or FormData
  let formattedBody = body;
  if (!isMultipart && !(body instanceof FormData)) {
    if (body && typeof body === 'object') {
      reqHeaders['Content-Type'] = 'application/json';
      formattedBody = JSON.stringify(body);
    }
  }

  let response;
  try {
    response = await fetch(url, {
      method,
      headers: reqHeaders,
      body: formattedBody,
      signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw err;
    }
    throw new ApiError({
      status: 0,
      code: 'network_error',
      message: 'Network error or server unreachable. Please check your connection.',
      raw: err,
    });
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  // Handle 401 Unauthorized (token refresh)
  if (response.status === 401 && !skipAuth && !_retry && !path.includes('/api/auth/login/') && !path.includes('/api/auth/token/refresh/')) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((newToken, error) => {
          if (error) {
            reject(error);
          } else {
            resolve(request(path, { ...options, _retry: true }));
          }
        });
      });
    }

    isRefreshing = true;
    try {
      const newToken = await refreshAuthToken();
      isRefreshing = false;
      onRefreshed(newToken, null);
      return request(path, { ...options, _retry: true });
    } catch (refreshErr) {
      isRefreshing = false;
      onRefreshed(null, refreshErr);
      throw refreshErr;
    }
  }

  // Parse response body
  let data = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    try {
      data = await response.text();
    } catch {
      data = null;
    }
  }

  // Handle Errors
  if (!response.ok) {
    let code = 'http_error';
    let message = response.statusText || 'An error occurred.';
    let fieldErrors = {};

    if (data && typeof data === 'object') {
      // Backend common/exceptions.py error envelope: { error: { code, message, details } }
      if (data.error) {
        code = data.error.code || code;
        message = data.error.message || message;
        fieldErrors = data.error.details || {};
      } else if (data.detail) {
        message = data.detail;
        code = response.status === 403 ? 'forbidden' : response.status === 404 ? 'not_found' : code;
      } else {
        // Collect field errors from DRF dict
        fieldErrors = data;
        const firstField = Object.keys(data)[0];
        if (firstField && Array.isArray(data[firstField])) {
          message = `${firstField}: ${data[firstField][0]}`;
        }
      }
    }

    throw new ApiError({
      status: response.status,
      code,
      message,
      fieldErrors,
      raw: data,
    });
  }

  return data;
}

// Convenience methods
export const api = {
  get: (path, params, options) => request(path, { ...options, method: 'GET', params }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
  patch: (path, body, options) => request(path, { ...options, method: 'PATCH', body }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
  upload: (path, formData, options) => request(path, { ...options, method: 'POST', body: formData, isMultipart: true }),
};

export default api;
