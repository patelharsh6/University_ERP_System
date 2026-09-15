// src/components/ui/Skeleton.jsx
import React from 'react';
import './Skeleton.css';

export const Skeleton = ({
  variant = 'text',
  rows = 4,
  columns = 4,
  width,
  height,
  className = '',
  style = {},
}) => {
  if (variant === 'table') {
    return (
      <div className={`skeleton-table-container ${className}`} style={style}>
        <div className="skeleton-table-header">
          {Array.from({ length: columns }).map((_, c) => (
            <div key={c} className="skeleton-cell skeleton-header-cell" />
          ))}
        </div>
        <div className="skeleton-table-body">
          {Array.from({ length: rows }).map((_, r) => (
            <div key={r} className="skeleton-table-row">
              {Array.from({ length: columns }).map((_, c) => (
                <div
                  key={c}
                  className="skeleton-cell"
                  style={{ width: `${60 + ((r * 13 + c * 17) % 35)}%` }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`skeleton-card-grid ${className}`} style={style}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton-card-header">
              <div className="skeleton-avatar" />
              <div className="skeleton-card-titles">
                <div className="skeleton-line title" />
                <div className="skeleton-line subtitle" />
              </div>
            </div>
            <div className="skeleton-card-content">
              <div className="skeleton-line" />
              <div className="skeleton-line" style={{ width: '80%' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'kpi') {
    return (
      <div className={`skeleton-kpi-grid ${className}`} style={style}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="skeleton-kpi-card">
            <div className="skeleton-kpi-icon" />
            <div className="skeleton-kpi-body">
              <div className="skeleton-line title" style={{ width: '60px' }} />
              <div className="skeleton-line kpi-value" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={`skeleton-list ${className}`} style={style}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="skeleton-list-item">
            <div className="skeleton-avatar" />
            <div className="skeleton-list-text">
              <div className="skeleton-line" style={{ width: '70%' }} />
              <div className="skeleton-line subtitle" style={{ width: '40%' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'avatar') {
    return (
      <div
        className={`skeleton-avatar ${className}`}
        style={{ width: width || height || '40px', height: height || width || '40px', ...style }}
      />
    );
  }

  // Default 'text' or custom shaped block
  return (
    <div
      className={`skeleton-line ${className}`}
      style={{
        width: width || '100%',
        height: height || '14px',
        ...style,
      }}
    />
  );
};

export default Skeleton;
