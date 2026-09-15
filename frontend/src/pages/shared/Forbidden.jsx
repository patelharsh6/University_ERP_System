// src/pages/shared/Forbidden.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiShield, FiArrowLeft, FiHome } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './Forbidden.css';

export const Forbidden = () => {
  const { role, user } = useAuth();
  const dashboardPath = `/${role === 'admin' ? 'a' : role === 'faculty' ? 'f' : 's'}/dashboard`;

  return (
    <div className="error-page-container">
      <div className="error-page-card">
        <div className="error-page-badge">403 ERROR</div>
        <div className="error-page-icon-box forbidden">
          <FiShield size={48} />
        </div>
        <h1 className="error-page-title">Access Restricted</h1>
        <p className="error-page-description">
          You do not have administrative or role privileges to access this area. Your account is logged in as{' '}
          <strong>{user?.name || 'User'}</strong> ({role || 'guest'}).
        </p>

        <div className="error-page-actions">
          <Link to={dashboardPath} className="btn btn-primary">
            <FiHome size={15} /> Go to My Dashboard
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

export default Forbidden;
