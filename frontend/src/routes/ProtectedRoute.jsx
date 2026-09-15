// src/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout/Layout';
import Loading from '../components/ui/Loading';

export const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading fullPage message="Validating session..." />;
  }

  if (!isAuthenticated) {
    const nextPath = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${nextPath}`} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/403" replace />;
  }

  const content = children || <Outlet />;

  return <Layout>{content}</Layout>;
};

export default ProtectedRoute;
