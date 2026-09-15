// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/auth.service';
import { tokenStorage } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [role, setRole] = useState(() => authService.getRole());
  const [loading, setLoading] = useState(true);

  // Synchronize user logout across tabs and 401 refresh failures
  const handleAuthLogout = useCallback(() => {
    setUser(null);
    setRole(null);
    tokenStorage.clearTokens();
  }, []);

  // Rehydrate and validate session on initial mount
  useEffect(() => {
    let isMounted = true;

    async function rehydrateSession() {
      if (tokenStorage.getAccessToken() || tokenStorage.getRefreshToken()) {
        try {
          const profile = await authService.getProfile();
          if (isMounted && profile) {
            setUser(profile);
            setRole(profile.role);
          }
        } catch (err) {
          // If token refresh also failed, logout
          if (isMounted) {
            handleAuthLogout();
          }
        }
      } else {
        handleAuthLogout();
      }

      if (isMounted) {
        setLoading(false);
      }
    }

    rehydrateSession();

    window.addEventListener('auth:logout', handleAuthLogout);
    return () => {
      isMounted = false;
      window.removeEventListener('auth:logout', handleAuthLogout);
    };
  }, [handleAuthLogout]);

  // Login handler
  const login = useCallback(async (identifier, password, remember = true) => {
    const result = await authService.login(identifier, password, remember);
    setUser(result.user);
    setRole(result.role);
    return result;
  }, []);

  // Logout handler
  const logout = useCallback(async () => {
    await authService.logout();
    handleAuthLogout();
  }, [handleAuthLogout]);

  // Profile refresh handler (e.g. after profile edit)
  const refreshUser = useCallback(async () => {
    try {
      const profile = await authService.getProfile();
      setUser(profile);
      setRole(profile.role);
      return profile;
    } catch {
      return null;
    }
  }, []);

  const value = {
    user,
    role,
    token: tokenStorage.getAccessToken(),
    isAuthenticated: Boolean(user && tokenStorage.getAccessToken()),
    loading,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
