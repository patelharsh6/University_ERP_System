import {
  formatDate,
  formatTime,
  formatDateTime,
  formatCurrency,
  formatPercent,
  formatFileSize,
  truncateText,
} from '../format';

describe('Format Utilities', () => {
  test('formatDate handles valid and null dates', () => {
    expect(formatDate(null)).toBe('—');
    expect(formatDate('2026-07-15')).toContain('2026');
    expect(formatDate('2026-07-15')).toContain('Jul');
  });

  test('formatTime handles 24h strings and invalid input', () => {
    expect(formatTime(null)).toBe('—');
    expect(formatTime('14:30:00')).toBe('02:30 PM');
    expect(formatTime('09:00')).toBe('09:00 AM');
  });

  test('formatCurrency formats Indian Rupee correctly', () => {
    expect(formatCurrency(null)).toBe('—');
    expect(formatCurrency(50000)).toMatch(/₹\s?50,000/);
  });

  test('formatPercent formats percentage with decimal', () => {
    expect(formatPercent(null)).toBe('—');
    expect(formatPercent(85.678, 1)).toBe('85.7%');
    expect(formatPercent(100, 0)).toBe('100%');
  });

  test('formatFileSize formats byte sizes into readable units', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(1024)).toBe('1 KB');
    expect(formatFileSize(1048576)).toBe('1 MB');
  });

  test('truncateText trims strings with ellipsis', () => {
    expect(truncateText('Short text', 20)).toBe('Short text');
    expect(truncateText('This is a very long string that should be truncated', 10)).toBe('This is a …');
  });
});
