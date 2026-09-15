// src/utils/constants.js

export const ATTENDANCE_THRESHOLD = 75;

export const ROLES = {
  STUDENT: 'student',
  FACULTY: 'faculty',
  ADMIN: 'admin',
};

export const PAGINATION_DEFAULTS = {
  PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};

export const STATUS_TYPES = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PAID: 'paid',
  OVERDUE: 'overdue',
  SUBMITTED: 'submitted',
  GRADED: 'graded',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'erp_access_token',
  REFRESH_TOKEN: 'erp_refresh_token',
  USER: 'erp_user',
  SIDEBAR_COLLAPSED: 'sidebar-collapsed',
  DARK_THEME: 'dark-theme',
};
