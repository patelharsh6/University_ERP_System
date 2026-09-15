// src/components/ui/SearchInput.jsx
import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import './FilterBar.css';

export const SearchInput = ({
  value,
  onChange,
  placeholder = 'Search...',
  onClear,
  size = 'md',
  className = '',
  ...props
}) => {
  return (
    <div className={`search-input-wrapper search-${size} ${className}`}>
      <FiSearch className="search-icon" size={15} />
      <input
        type="text"
        className="search-field"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        {...props}
      />
      {value && (
        <button
          type="button"
          className="search-clear-btn"
          onClick={() => {
            if (onClear) onClear();
            else onChange('');
          }}
          aria-label="Clear search"
        >
          <FiX size={13} />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
