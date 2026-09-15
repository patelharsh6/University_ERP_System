// src/routes/PublicRoute.jsx
import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/ui/Loading';

export const PublicRoute = ({ children }) => {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading fullPage message="Loading..." />;
  }

  if (isAuthenticated) {
    // Check if next redirect exists in query string
    const params = new URLSearchParams(location.search);
    const next = params.get('next');
    if (next && next.startsWith('/')) {
      return <Navigate to={next} replace />;
    }

    const defaultDashboard = `/${role === 'admin' ? 'a' : role === 'faculty' ? 'f' : 's'}/dashboard`;
    return <Navigate to={defaultDashboard} replace />;
  }

  return children || <Outlet />;
};

export default PublicRoute;
