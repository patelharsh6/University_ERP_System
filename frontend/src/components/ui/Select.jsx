// src/components/ui/Select.jsx
import React from 'react';
import { FiChevronDown } from 'react-icons/fi';
import './FilterBar.css';

export const Select = ({
  options = [],
  value,
  onChange,
  placeholder = 'Select option...',
  label,
  size = 'md',
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`select-wrapper select-${size} ${className}`}>
      {label && <label className="select-label">{label}</label>}
      <div className="select-box">
        <select
          className="select-element"
          value={value !== undefined && value !== null ? value : ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => {
            const optValue = typeof opt === 'object' ? opt.value : opt;
            const optLabel = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={String(optValue)} value={optValue}>
                {optLabel}
              </option>
            );
          })}
        </select>
        <FiChevronDown className="select-arrow" size={14} />
      </div>
    </div>
  );
};

export default Select;
