// src/pages/shared/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiAlertCircle, FiArrowLeft, FiHome } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './Forbidden.css';

export const NotFound = () => {
  const { role, isAuthenticated } = useAuth();
  const dashboardPath = isAuthenticated
    ? `/${role === 'admin' ? 'a' : role === 'faculty' ? 'f' : 's'}/dashboard`
    : '/login';

  return (
    <div className="error-page-container">
      <div className="error-page-card">
        <div className="error-page-badge">404 ERROR</div>
        <div className="error-page-icon-box notfound">
          <FiAlertCircle size={48} />
        </div>
        <h1 className="error-page-title">Page Not Found</h1>
        <p className="error-page-description">
          The page or resource you requested does not exist, has been removed, or the link may be broken.
        </p>

        <div className="error-page-actions">
          <Link to={dashboardPath} className="btn btn-primary">
            <FiHome size={15} /> {isAuthenticated ? 'Go to My Dashboard' : 'Go to Login'}
          </Link>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => window.history.back()}
          >
            <FiArrowLeft size={15} /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
