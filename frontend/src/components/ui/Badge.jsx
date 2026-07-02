import React from 'react';
import './Badge.css';

const Badge = ({ children, variant = 'default', className = "" }) => {
  return (
    <span className={`premium-badge premium-badge-${variant} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
