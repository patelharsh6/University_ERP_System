// src/components/ui/FilterBar.jsx
import React from 'react';
import { FiFilter, FiRotateCcw } from 'react-icons/fi';
import './FilterBar.css';

export const FilterBar = ({
  children,
  onReset,
  hasActiveFilters = false,
  className = '',
}) => {
  return (
    <div className={`filter-bar-container ${className}`}>
      <div className="filter-bar-inputs">
        <div className="filter-bar-icon-tag">
          <FiFilter size={14} /> Filters
        </div>
        {children}
      </div>

      {hasActiveFilters && onReset && (
        <button
          type="button"
          className="filter-reset-btn"
          onClick={onReset}
          aria-label="Reset all filters"
        >
          <FiRotateCcw size={12} /> Reset
        </button>
      )}
    </div>
  );
};

export default FilterBar;
