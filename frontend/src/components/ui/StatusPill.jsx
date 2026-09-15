// src/components/ui/StatusPill.jsx
import React from 'react';
import {
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiAlertCircle,
  FiMinusCircle,
} from 'react-icons/fi';
import './StatusPill.css';

const STATUS_CONFIGS = {
  // Positive / Success
  present: { variant: 'success', label: 'Present', icon: FiCheckCircle },
  paid: { variant: 'success', label: 'Paid', icon: FiCheckCircle },
  approved: { variant: 'success', label: 'Approved', icon: FiCheckCircle },
  active: { variant: 'success', label: 'Active', icon: FiCheckCircle },
  published: { variant: 'success', label: 'Published', icon: FiCheckCircle },
  graded: { variant: 'success', label: 'Graded', icon: FiCheckCircle },
  pass: { variant: 'success', label: 'Pass', icon: FiCheckCircle },
  cleared: { variant: 'success', label: 'Cleared', icon: FiCheckCircle },

  // Negative / Danger
  absent: { variant: 'danger', label: 'Absent', icon: FiXCircle },
  overdue: { variant: 'danger', label: 'Overdue', icon: FiAlertCircle },
  rejected: { variant: 'danger', label: 'Rejected', icon: FiXCircle },
  fail: { variant: 'danger', label: 'Fail', icon: FiXCircle },
  suspended: { variant: 'danger', label: 'Suspended', icon: FiMinusCircle },
  inactive: { variant: 'neutral', label: 'Inactive', icon: FiMinusCircle },

  // Warning / Attention
  late: { variant: 'warning', label: 'Late', icon: FiClock },
  pending: { variant: 'warning', label: 'Pending', icon: FiClock },
  partial: { variant: 'warning', label: 'Partial', icon: FiClock },
  under_review: { variant: 'warning', label: 'Under Review', icon: FiClock },

  // Info / Actioned
  submitted: { variant: 'info', label: 'Submitted', icon: FiCheckCircle },
  excused: { variant: 'info', label: 'Excused', icon: FiCheckCircle },
  draft: { variant: 'neutral', label: 'Draft', icon: FiClock },
};

export const StatusPill = ({
  status,
  variant,
  label,
  icon: CustomIcon,
  showDot = false,
  showIcon = true,
  size = 'md',
  className = '',
}) => {
  const normalizedKey = String(status || '').toLowerCase().trim().replace(/[\s-]/g, '_');
  const config = STATUS_CONFIGS[normalizedKey] || {
    variant: variant || 'neutral',
    label: label || status || '—',
    icon: null,
  };

  const finalVariant = variant || config.variant;
  const displayLabel = label || config.label;
  const IconComponent = CustomIcon || (showIcon ? config.icon : null);

  return (
    <span className={`status-pill pill-${finalVariant} pill-${size} ${className}`}>
      {showDot && <span className="status-pill-dot" />}
      {IconComponent && <IconComponent className="status-pill-icon" size={size === 'sm' ? 11 : 13} />}
      <span className="status-pill-label">{displayLabel}</span>
    </span>
  );
};

export default StatusPill;
