import React from 'react';
import './Card.css';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  title, 
  subtitle, 
  action, 
  className = "", 
  hoverEffect = false,
  noPadding = false,
  onClick
}) => {
  const Component = hoverEffect || onClick ? motion.div : 'div';
  const motionProps = (hoverEffect || onClick) ? {
    whileHover: { y: -2, boxShadow: 'var(--shadow-md)', borderColor: 'var(--primary)' },
    transition: { duration: 0.2 }
  } : {};

  return (
    <Component 
      className={`premium-ui-card ${noPadding ? 'no-padding' : ''} ${className}`}
      onClick={onClick}
      {...motionProps}
    >
      {(title || subtitle || action) && (
        <div className="premium-card-header">
          <div>
            {title && <h3 className="premium-card-title">{title}</h3>}
            {subtitle && <p className="premium-card-subtitle">{subtitle}</p>}
          </div>
          {action && <div className="premium-card-action">{action}</div>}
        </div>
      )}
      <div className={`premium-card-content ${noPadding ? 'no-padding' : ''}`}>
        {children}
      </div>
    </Component>
  );
};

export default Card;
