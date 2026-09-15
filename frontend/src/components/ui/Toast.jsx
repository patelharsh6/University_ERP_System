// src/components/ui/Toast.jsx
import React from 'react';
import {
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
  FiAlertTriangle,
  FiX,
} from 'react-icons/fi';
import './Toast.css';

const ICONS = {
  success: FiCheckCircle,
  danger: FiAlertCircle,
  error: FiAlertCircle,
  warning: FiAlertTriangle,
  info: FiInfo,
};

export const ToastItem = ({ toast, onDismiss }) => {
  const normalizedType = toast.type === 'error' ? 'danger' : toast.type;
  const Icon = ICONS[normalizedType] || FiInfo;

  return (
    <div className={`toast-card toast-${normalizedType}`} role="alert">
      <div className="toast-icon-wrapper">
        <Icon size={18} />
      </div>

      <div className="toast-body">
        {toast.title && <h5 className="toast-title">{toast.title}</h5>}
        {toast.message && <p className="toast-message">{toast.message}</p>}
      </div>

      <button
        type="button"
        className="toast-close-btn"
        onClick={() => onDismiss(toast.id)}
        aria-label="Close notification"
      >
        <FiX size={14} />
      </button>
    </div>
  );
};

export const ToastContainer = ({ toasts = [], onDismiss }) => {
  if (!toasts.length) return null;

  return (
    <div className="toast-viewport">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

export default ToastContainer;
