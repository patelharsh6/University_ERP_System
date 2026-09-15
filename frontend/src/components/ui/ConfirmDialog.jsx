// src/components/ui/ConfirmDialog.jsx
import React from 'react';
import Modal from './Modal';
import { FiAlertTriangle, FiInfo, FiCheckCircle } from 'react-icons/fi';
import './Modal.css';

export const ConfirmDialog = ({
  isOpen,
  onConfirm,
  onCancel,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}) => {
  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return <FiAlertTriangle size={24} className="confirm-icon danger" />;
      case 'warning':
        return <FiAlertTriangle size={24} className="confirm-icon warning" />;
      default:
        return <FiInfo size={24} className="confirm-icon primary" />;
    }
  };

  const footer = (
    <div className="confirm-dialog-actions">
      <button
        type="button"
        className="btn btn-secondary"
        onClick={onCancel}
        disabled={loading}
      >
        {cancelText}
      </button>
      <button
        type="button"
        className={`btn btn-${variant === 'danger' ? 'danger' : 'primary'}`}
        onClick={onConfirm}
        disabled={loading}
      >
        {loading ? 'Processing...' : confirmText}
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={null}
      size="sm"
      footer={footer}
      className="confirm-dialog-modal"
    >
      <div className="confirm-dialog-content">
        <div className="confirm-icon-box">{getIcon()}</div>
        <div className="confirm-text">
          <h4 className="confirm-title">{title}</h4>
          <p className="confirm-message">{message}</p>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
