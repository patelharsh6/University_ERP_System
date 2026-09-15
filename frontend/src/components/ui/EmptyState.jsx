// src/components/ui/EmptyState.jsx
import React from 'react';
import { FiInbox } from 'react-icons/fi';
import './EmptyState.css';

export const EmptyState = ({
  icon: Icon = FiInbox,
  title = 'No records found',
  description = 'There is currently no data to display here.',
  actionText,
  onAction,
  actionIcon: ActionIcon,
  compact = false,
  className = '',
}) => {
  return (
    <div className={`empty-state-container ${compact ? 'empty-compact' : ''} ${className}`}>
      <div className="empty-state-icon-wrapper">
        <Icon size={compact ? 24 : 36} className="empty-state-icon" />
      </div>

      <div className="empty-state-content">
        <h4 className="empty-state-title">{title}</h4>
        {description && <p className="empty-state-description">{description}</p>}

        {actionText && onAction && (
          <div className="empty-state-actions">
            <button type="button" className="btn btn-primary empty-action-btn" onClick={onAction}>
              {ActionIcon && <ActionIcon size={14} />} {actionText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
