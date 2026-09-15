// src/services/auth.service.js
import api, { tokenStorage } from './api';
import { endpoints } from './endpoints';
import { STORAGE_KEYS } from '../utils/constants';

export const authService = {
  /**
   * Log in user with identifier and password.
   */
  async login(identifier, password, remember = true) {
    const data = await api.post(
      endpoints.auth.login,
      { identifier, password },
      { skipAuth: true }
    );

    const accessToken = data.access || data.token;
    const refreshToken = data.refresh;
    const user = data.user || {
      id: data.id,
      name: data.name,
      role: data.role,
      email: data.email,
    };

    if (accessToken) {
      tokenStorage.setAccessToken(accessToken, remember);
    }
    if (refreshToken) {
      tokenStorage.setRefreshToken(refreshToken, remember);
    }
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    }

    return { token: accessToken, refresh: refreshToken, user, role: data.role || user?.role };
  },

  /**
   * Log out user and invalidate refresh token on the backend.
   */
  async logout() {
    const refreshToken = tokenStorage.getRefreshToken();
    try {
      if (refreshToken) {
        await api.post(endpoints.auth.logout, { refresh: refreshToken });
      }
    } catch {
      // Ignore network failures on logout
    } finally {
      tokenStorage.clearTokens();
    }
  },

  /**
   * Fetch currently authenticated user profile.
   */
  async getProfile() {
    const user = await api.get(endpoints.auth.profile);
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    }
    return user;
  },

  /**
   * Update profile.
   */
  async updateProfile(updates) {
    const user = await api.patch(endpoints.auth.profile, updates);
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    }
    return user;
  },

  /**
   * Get cached user from localStorage.
   */
  getCurrentUser() {
    const cached = localStorage.getItem(STORAGE_KEYS.USER);
    if (!cached) return null;
    try {
      return JSON.parse(cached);
    } catch {
      return null;
    }
  },

  /**
   * Check if an access or refresh token is available.
   */
  isAuthenticated() {
    return Boolean(tokenStorage.getAccessToken() || tokenStorage.getRefreshToken());
  },

  /**
   * Get user role from storage.
   */
  getRole() {
    const user = this.getCurrentUser();
    return user?.role || null;
  },
};

export default authService;
