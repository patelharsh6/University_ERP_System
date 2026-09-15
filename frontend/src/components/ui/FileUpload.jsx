// src/components/ui/FileUpload.jsx
import React, { useRef, useState } from 'react';
import { FiUploadCloud, FiFile, FiX, FiCheck } from 'react-icons/fi';
import { formatFileSize } from '../../utils/format';
import './FileUpload.css';

export const FileUpload = ({
  file,
  onFileSelect,
  onFileRemove,
  accept = '.pdf,.doc,.docx,.png,.jpg,.jpeg,.zip',
  maxSizeMB = 10,
  label = 'Upload Document or Assignment',
  helperText,
  disabled = false,
  className = '',
}) => {
  const inputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (selectedFile) => {
    setError(null);
    if (!selectedFile) return;

    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds maximum allowed limit of ${maxSizeMB} MB.`);
      return;
    }

    onFileSelect(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className={`file-upload-container ${className}`}>
      {label && <label className="file-upload-label">{label}</label>}

      {!file ? (
        <div
          className={`file-dropzone ${isDragOver ? 'drag-over' : ''} ${disabled ? 'disabled' : ''}`}
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !disabled && inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            style={{ display: 'none' }}
            onChange={(e) => handleFileChange(e.target.files?.[0])}
            disabled={disabled}
          />
          <div className="file-dropzone-icon">
            <FiUploadCloud size={32} />
          </div>
          <div className="file-dropzone-text">
            <span className="file-dropzone-main">Click to upload or drag & drop</span>
            <span className="file-dropzone-sub">
              {helperText || `Supported formats: ${accept} (Max ${maxSizeMB}MB)`}
            </span>
          </div>
        </div>
      ) : (
        <div className="file-preview-card">
          <div className="file-preview-icon">
            <FiFile size={22} />
          </div>
          <div className="file-preview-info">
            <span className="file-preview-name">{file.name}</span>
            <span className="file-preview-meta">
              {formatFileSize(file.size)} · <FiCheck className="file-check-icon" /> Ready
            </span>
          </div>
          {!disabled && (
            <button
              type="button"
              className="file-remove-btn"
              onClick={onFileRemove}
              aria-label="Remove uploaded file"
            >
              <FiX size={16} />
            </button>
          )}
        </div>
      )}

      {error && <p className="file-upload-error">{error}</p>}
    </div>
  );
};

export default FileUpload;
