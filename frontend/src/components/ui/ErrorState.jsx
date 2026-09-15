// src/components/ui/ErrorState.jsx
import React, { useState } from 'react';
import { FiAlertTriangle, FiRefreshCw, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import './ErrorState.css';

export const ErrorState = ({
  error,
  onRetry,
  title,
  compact = false,
  className = '',
}) => {
  const [showDetails, setShowDetails] = useState(false);

  // Normalize error message and fields
  let message = 'An unexpected error occurred while loading data.';
  let statusCode = null;
  let fieldErrors = null;

  if (typeof error === 'string') {
    message = error;
  } else if (error) {
    message = error.message || message;
    statusCode = error.status;
    if (error.fieldErrors && Object.keys(error.fieldErrors).length > 0) {
      fieldErrors = error.fieldErrors;
    }
  }

  const defaultTitle = statusCode === 403
    ? 'Access Restricted'
    : statusCode === 404
    ? 'Resource Not Found'
    : statusCode === 0
    ? 'Connection Error'
    : 'Unable to Load Data';

  return (
    <div className={`error-state-card ${compact ? 'error-compact' : ''} ${className}`}>
      <div className="error-icon-wrapper">
        <FiAlertTriangle className="error-icon" size={compact ? 22 : 32} />
      </div>

      <div className="error-content">
        <div className="error-header-row">
          <h3 className="error-title">{title || defaultTitle}</h3>
          {statusCode && <span className="error-status-badge">HTTP {statusCode}</span>}
        </div>

        <p className="error-message">{message}</p>

        {fieldErrors && (
          <div className="error-details-section">
            <button
              type="button"
              className="error-details-toggle"
              onClick={() => setShowDetails((prev) => !prev)}
            >
              {showDetails ? <FiChevronUp /> : <FiChevronDown />}
              {showDetails ? 'Hide technical details' : 'View technical details'}
            </button>

            {showDetails && (
              <ul className="error-field-list">
                {Object.entries(fieldErrors).map(([field, errList]) => (
                  <li key={field}>
                    <strong>{field}:</strong> {Array.isArray(errList) ? errList.join(', ') : String(errList)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {onRetry && (
          <div className="error-actions">
            <button type="button" className="btn btn-primary error-retry-btn" onClick={onRetry}>
              <FiRefreshCw size={14} /> Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorState;
