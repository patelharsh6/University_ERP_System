// src/components/ui/Pagination.jsx
import React from 'react';
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';
import './Pagination.css';

export const Pagination = ({
  page = 1,
  totalPages = 1,
  count = 0,
  pageSize = 20,
  onPageChange,
  showInfo = true,
  className = '',
}) => {
  if (totalPages <= 1 && count <= pageSize) {
    return null;
  }

  const startItem = count === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, count);

  // Generate page numbers with ellipses
  const getPageNumbers = () => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
      range.push(i);
    }

    if (page - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (page + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const pages = getPageNumbers();

  return (
    <div className={`pagination-container ${className}`}>
      {showInfo && (
        <div className="pagination-info">
          Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of <strong>{count}</strong> entries
        </div>
      )}

      <div className="pagination-controls">
        {/* First Page */}
        <button
          type="button"
          className="pagination-btn"
          disabled={page <= 1}
          onClick={() => onPageChange(1)}
          aria-label="First page"
        >
          <FiChevronsLeft size={14} />
        </button>

        {/* Previous Page */}
        <button
          type="button"
          className="pagination-btn"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <FiChevronLeft size={14} />
        </button>

        {/* Numeric Page Buttons */}
        <div className="pagination-pages">
          {pages.map((p, idx) => {
            if (p === '...') {
              return (
                <span key={`dots-${idx}`} className="pagination-ellipsis">
                  …
                </span>
              );
            }
            return (
              <button
                key={p}
                type="button"
                className={`pagination-page-btn ${page === p ? 'active' : ''}`}
                onClick={() => onPageChange(p)}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Next Page */}
        <button
          type="button"
          className="pagination-btn"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <FiChevronRight size={14} />
        </button>

        {/* Last Page */}
        <button
          type="button"
          className="pagination-btn"
          disabled={page >= totalPages}
          onClick={() => onPageChange(totalPages)}
          aria-label="Last page"
        >
          <FiChevronsRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
