// src/components/ui/PageHeader.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import './PageHeader.css';

export const PageHeader = ({
  title,
  subtitle,
  icon: Icon,
  breadcrumbs = [],
  badge,
  actions,
  children,
  className = '',
}) => {
  return (
    <header className={`page-header-container ${className}`}>
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <nav className="page-header-breadcrumbs" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {crumb.path ? (
                <Link to={crumb.path} className="breadcrumb-link">
                  {crumb.label}
                </Link>
              ) : (
                <span className="breadcrumb-current">{crumb.label}</span>
              )}
              {idx < breadcrumbs.length - 1 && (
                <FiChevronRight className="breadcrumb-separator" size={12} />
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Main Title Row */}
      <div className="page-header-main">
        <div className="page-header-title-group">
          {Icon && (
            <div className="page-header-icon-box">
              {React.isValidElement(Icon) ? Icon : <Icon size={22} />}
            </div>
          )}
          <div>
            <div className="page-header-heading-row">
              <h1 className="page-header-title">{title}</h1>
              {badge && <span className="page-header-badge">{badge}</span>}
            </div>
            {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
          </div>
        </div>

        {actions && <div className="page-header-actions">{actions}</div>}
      </div>

      {/* Optional Inlaid Filters / Tabs */}
      {children && <div className="page-header-footer">{children}</div>}
    </header>
  );
};

export default PageHeader;
