import { endpoints } from '../endpoints';

describe('Endpoints Dictionary', () => {
  test('auth endpoints are defined correctly', () => {
    expect(endpoints.auth.login).toBe('/api/auth/login/');
    expect(endpoints.auth.refresh).toBe('/api/auth/token/refresh/');
    expect(endpoints.auth.profile).toBe('/api/auth/profile/');
    expect(endpoints.auth.logout).toBe('/api/auth/logout/');
    expect(endpoints.auth.userDetail(42)).toBe('/api/auth/users/42/');
  });

  test('students and courses dynamic endpoints work', () => {
    expect(endpoints.students.detail(10)).toBe('/api/students/10/');
    expect(endpoints.students.summary).toBe('/api/students/me/summary/');
    expect(endpoints.courses.submissions(5)).toBe('/api/courses/assignments/5/submissions/');
    expect(endpoints.courses.submissionDetail(5, 2)).toBe('/api/courses/assignments/5/submissions/2/');
  });

  test('attendance, results and fees endpoints are mapped', () => {
    expect(endpoints.attendance.list).toBe('/api/attendance/');
    expect(endpoints.attendance.timetable).toBe('/api/attendance/timetable/');
    expect(endpoints.results.transcript).toBe('/api/results/transcript/');
    expect(endpoints.fees.structure).toBe('/api/fees/structure/');
  });
});
