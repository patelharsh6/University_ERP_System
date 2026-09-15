// src/components/ui/Loading.jsx
import React from 'react';
import './Loading.css';

export const Loading = ({
  message = 'Loading data...',
  size = 'md',
  fullPage = false,
  className = '',
}) => {
  const content = (
    <div className={`loading-container loading-${size} ${className}`}>
      <div className="loading-spinner" />
      {message && <p className="loading-text">{message}</p>}
    </div>
  );

  if (fullPage) {
    return <div className="loading-full-page">{content}</div>;
  }

  return content;
};

export default Loading;
