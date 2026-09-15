// src/utils/format.js

/**
 * Format a date string (ISO or Date object) to readable date format.
 * Example: '2026-07-15' -> '15 Jul 2026'
 */
export function formatDate(dateInput, options = {}) {
  if (!dateInput) return options.fallback || '—';
  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) return String(dateInput);

    const defaultOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      ...options,
    };
    return new Intl.DateTimeFormat('en-IN', defaultOptions).format(date);
  } catch {
    return String(dateInput);
  }
}

/**
 * Format a 24-hour time or ISO timestamp to 12-hour AM/PM format.
 * Example: '14:30:00' -> '02:30 PM' or '09:00' -> '09:00 AM'
 */
export function formatTime(timeInput) {
  if (!timeInput) return '—';
  if (typeof timeInput === 'string' && timeInput.includes(':') && !timeInput.includes('T')) {
    const [h, m] = timeInput.split(':');
    const hour = parseInt(h, 10);
    const minute = m || '00';
    if (isNaN(hour)) return timeInput;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${String(hour12).padStart(2, '0')}:${minute} ${ampm}`;
  }

  try {
    const date = new Date(timeInput);
    if (isNaN(date.getTime())) return String(timeInput);
    return new Intl.DateTimeFormat('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return String(timeInput);
  }
}

/**
 * Format full date & time.
 * Example: '2026-07-15T14:30:00Z' -> '15 Jul 2026, 02:30 PM'
 */
export function formatDateTime(dateTimeInput) {
  if (!dateTimeInput) return '—';
  try {
    const date = new Date(dateTimeInput);
    if (isNaN(date.getTime())) return String(dateTimeInput);
    return `${formatDate(date)}, ${formatTime(date)}`;
  } catch {
    return String(dateTimeInput);
  }
}

/**
 * Format currency value.
 * Example: 45000 -> '₹45,000'
 */
export function formatCurrency(amount, currency = 'INR') {
  if (amount === null || amount === undefined || isNaN(Number(amount))) return '—';
  const num = Number(amount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: num % 1 === 0 ? 0 : 2,
  }).format(num);
}

/**
 * Format percentage with decimal places.
 * Example: 85.678 -> '85.7%'
 */
export function formatPercent(value, decimals = 1) {
  if (value === null || value === undefined || isNaN(Number(value))) return '—';
  const num = Number(value);
  return `${num.toFixed(decimals)}%`;
}

/**
 * Format file sizes in human-readable units.
 * Example: 1048576 -> '1 MB'
 */
export function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Truncate long strings with ellipsis.
 */
export function truncateText(text, maxLength = 50) {
  if (!text || typeof text !== 'string') return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}…`;
}
