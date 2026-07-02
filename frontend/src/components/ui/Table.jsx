import React from 'react';
import './Table.css';

const Table = ({ columns, data, className = "" }) => {
  return (
    <div className={`premium-table-container ${className}`}>
      <table className="premium-table">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index} className={col.align ? `text-${col.align}` : ''}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="premium-table-empty">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className={col.align ? `text-${col.align}` : ''}>
                    {col.accessor ? row[col.accessor] : col.cell ? col.cell(row) : null}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
