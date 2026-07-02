import React from 'react';
import './Button.css';
import { motion } from 'framer-motion';
import { FiLoader } from 'react-icons/fi';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = "", 
  isLoading = false,
  icon,
  ...props 
}) => {
  return (
    <motion.button 
      className={`premium-btn premium-btn-${variant} premium-btn-${size} ${className} ${isLoading ? 'loading' : ''}`}
      whileHover={{ y: isLoading ? 0 : -1 }}
      whileTap={{ scale: isLoading ? 1 : 0.98 }}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <FiLoader className="btn-spinner" />
      ) : icon ? (
        <span className="btn-icon">{icon}</span>
      ) : null}
      <span className="btn-content">{children}</span>
    </motion.button>
  );
};

export default Button;
