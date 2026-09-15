// src/components/ui/Table.jsx
import React from 'react';
import Skeleton from './Skeleton';
import ErrorState from './ErrorState';
import EmptyState from './EmptyState';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
import './Table.css';

export const Table = ({
  columns = [],
  data = [],
  loading = false,
  error = null,
  onRetry,
  emptyTitle = 'No records found',
  emptyDescription = 'No data is currently available.',
  onRowClick,
  sortBy,
  sortDirection = 'asc',
  onSort,
  skeletonRows = 5,
  className = '',
}) => {
  if (loading) {
    return <Skeleton variant="table" rows={skeletonRows} columns={columns.length || 4} />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={onRetry} />;
  }

  if (!data || data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} compact />;
  }

  return (
    <div className={`premium-table-container ${className}`}>
      <table className="premium-table">
        <thead>
          <tr>
            {columns.map((col, index) => {
              const isSortable = Boolean(onSort && (col.accessor || col.sortKey));
              const sortKey = col.sortKey || col.accessor;
              const isSorted = sortBy === sortKey;

              return (
                <th
                  key={index}
                  className={`${col.align ? `text-${col.align}` : ''} ${isSortable ? 'th-sortable' : ''}`}
                  onClick={isSortable ? () => onSort(sortKey) : undefined}
                  style={col.width ? { width: col.width } : undefined}
                >
                  <div className="th-content">
                    <span>{col.header}</span>
                    {isSortable && isSorted && (
                      <span className="sort-icon">
                        {sortDirection === 'desc' ? <FiArrowDown size={13} /> : <FiArrowUp size={13} />}
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={row.id || rowIndex}
              className={onRowClick ? 'tr-clickable' : ''}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((col, colIndex) => (
                <td key={colIndex} className={col.align ? `text-${col.align}` : ''}>
                  {col.cell
                    ? col.cell(row, rowIndex)
                    : col.accessor
                    ? row[col.accessor] !== undefined && row[col.accessor] !== null
                      ? row[col.accessor]
                      : '—'
                    : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
