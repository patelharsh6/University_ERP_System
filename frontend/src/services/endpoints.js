// src/services/endpoints.js

/**
 * Centralized mapping of all application API endpoints.
 * Never hardcode URL paths directly in React components.
 */
export const endpoints = {
  auth: {
    login: '/api/auth/login/',
    refresh: '/api/auth/token/refresh/',
    logout: '/api/auth/logout/',
    profile: '/api/auth/profile/',
    register: '/api/auth/register/',
    users: '/api/auth/users/',
    userDetail: (id) => `/api/auth/users/${id}/`,
  },
  students: {
    list: '/api/students/',
    detail: (id) => `/api/students/${id}/`,
    leaves: '/api/students/leaves/',
    leaveDetail: (id) => `/api/students/leaves/${id}/`,
    clearance: '/api/students/clearance/',
    clearanceDetail: (id) => `/api/students/clearance/${id}/`,
    summary: '/api/students/me/summary/',
  },
  faculty: {
    list: '/api/faculty/',
    detail: (id) => `/api/faculty/${id}/`,
    summary: '/api/faculty/me/summary/',
  },
  courses: {
    list: '/api/courses/',
    detail: (id) => `/api/courses/${id}/`,
    subjects: '/api/courses/subjects/',
    subjectDetail: (id) => `/api/courses/subjects/${id}/`,
    enrollments: '/api/courses/enrollments/',
    enrollmentDetail: (id) => `/api/courses/enrollments/${id}/`,
    assignments: '/api/courses/assignments/',
    assignmentDetail: (id) => `/api/courses/assignments/${id}/`,
    submissions: (assignmentId) => assignmentId ? `/api/courses/assignments/${assignmentId}/submissions/` : '/api/courses/submissions/',
    submissionList: '/api/courses/submissions/',
    submissionDetail: (assignmentId, subId) => subId ? `/api/courses/assignments/${assignmentId}/submissions/${subId}/` : `/api/courses/submissions/${assignmentId}/`,
    materials: '/api/courses/materials/',
    materialDetail: (id) => `/api/courses/materials/${id}/`,
  },
  attendance: {
    list: '/api/attendance/',
    detail: (id) => `/api/attendance/${id}/`,
    timetable: '/api/attendance/timetable/',
    timetableDetail: (id) => `/api/attendance/timetable/${id}/`,
    summary: '/api/attendance/summary/',
  },
  results: {
    list: '/api/results/',
    detail: (id) => `/api/results/${id}/`,
    transcript: '/api/results/transcript/',
  },
  fees: {
    list: '/api/fees/',
    detail: (id) => `/api/fees/${id}/`,
    structure: '/api/fees/structure/',
    structureDetail: (id) => `/api/fees/structure/${id}/`,
  },
  announcements: {
    list: '/api/announcements/',
    detail: (id) => `/api/announcements/${id}/`,
    notifications: '/api/announcements/notifications/',
    notificationDetail: (id) => `/api/announcements/notifications/${id}/`,
  },
  feedback: {
    list: '/api/feedback/',
    detail: (id) => `/api/feedback/${id}/`,
    summary: '/api/feedback/summary/',
  },
  exams: {
    schedule: '/api/exams/schedule/',
    scheduleDetail: (id) => `/api/exams/schedule/${id}/`,
  },
  calendar: {
    holidays: '/api/calendar/holidays/',
    holidayDetail: (id) => `/api/calendar/holidays/${id}/`,
  },
  counselling: {
    sessions: '/api/counselling/sessions/',
    sessionDetail: (id) => `/api/counselling/sessions/${id}/`,
  },
  admin: {
    summary: '/api/admin/summary/',
  },
};
