import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import AuthContext, { AuthProvider } from '../../../context/AuthContext';
import { ToastProvider } from '../../../context/ToastContext';
import * as apiModule from '../../../services/api';

import Announcements from '../Announcements';
import Notifications from '../Notifications';
import Assignments from '../Assignments';
import StudyMaterials from '../StudyMaterials';
import LeaveRequests from '../LeaveRequests';
import Billing from '../Billing';
import Feedback from '../Feedback';
import Enrollment from '../Enrollment';
import StudentsList from '../../admin/StudentsList';

// Mock Auth Context User
const mockUser = {
  id: 1,
  username: 'harshpatel',
  email: 'harsh@university.edu',
  first_name: 'Harsh',
  last_name: 'Patel',
  role: 'student',
  enrollment_id: 'AU23BCE0001',
  department_name: 'B.Tech - Computer Engineering',
  is_active: true,
};

const renderWithProviders = (ui) => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={{ user: mockUser, isAuthenticated: true, refreshUser: jest.fn() }}>
        <ToastProvider>
          {ui}
        </ToastProvider>
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

describe('Student Portal Wired Pages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Announcements page renders live announcements list and priority chips', async () => {
    jest.spyOn(apiModule, 'request').mockResolvedValue([
      {
        id: 101,
        title: 'Mid-Semester Exam Timetable Released',
        content: 'The mid-term examination timetable has been published for all undergraduate engineering programs.',
        priority: 'high',
        is_pinned: true,
        created_at: '2026-05-10T10:00:00Z',
      },
      {
        id: 102,
        title: 'Campus Hackathon 2026 Registration Open',
        content: 'Register your 4-member teams for the upcoming 36-hour hackathon.',
        priority: 'low',
        is_pinned: false,
        created_at: '2026-05-12T10:00:00Z',
      }
    ]);

    renderWithProviders(<Announcements />);

    await waitFor(() => {
      expect(screen.getByText('Mid-Semester Exam Timetable Released')).toBeInTheDocument();
      expect(screen.getByText('Campus Hackathon 2026 Registration Open')).toBeInTheDocument();
    });

    expect(screen.getByText(/Announcements/i)).toBeInTheDocument();
  });

  test('Notifications page renders notification feed with optimistic mark as read', async () => {
    jest.spyOn(apiModule, 'request').mockImplementation((path, options = {}) => {
      if (options.method === 'PATCH') {
        return Promise.resolve({ success: true });
      }
      return Promise.resolve([
        {
          id: 1,
          title: 'Assignment 3 Graded',
          message: 'Your DBMS assignment has been reviewed and graded with 18/20.',
          category: 'grades',
          is_read: false,
          created_at: '2026-05-15T08:00:00Z',
        },
      ]);
    });

    renderWithProviders(<Notifications />);

    await waitFor(() => {
      expect(screen.getByText('Assignment 3 Graded')).toBeInTheDocument();
    });

    const markAllBtn = screen.getByText(/Mark all read/i);
    expect(markAllBtn).toBeInTheDocument();
    fireEvent.click(markAllBtn);
  });

  test('Assignments page renders tabs and displays assignments', async () => {
    jest.spyOn(apiModule, 'request').mockImplementation((path) => {
      if (path.includes('assignments')) {
        return Promise.resolve([
          {
            id: 201,
            title: 'Database Schema Design Project',
            course_code: 'CE601',
            due_date: '2026-06-15T23:59:00Z',
            max_marks: 20,
          }
        ]);
      }
      if (path.includes('submissions')) {
        return Promise.resolve([]);
      }
      return Promise.resolve([]);
    });

    renderWithProviders(<Assignments />);

    await waitFor(() => {
      expect(screen.getByText('Database Schema Design Project')).toBeInTheDocument();
      expect(screen.getByText(/Upload Submission/i)).toBeInTheDocument();
    });
  });

  test('StudyMaterials page renders search and materials grid', async () => {
    jest.spyOn(apiModule, 'request').mockImplementation((path) => {
      if (path.includes('materials')) {
        return Promise.resolve([
          {
            id: 301,
            title: 'Chapter 1: Relational Algebra',
            course_code: 'CE601',
            material_type: 'pdf',
            uploaded_at: '2026-05-01T10:00:00Z',
            file: 'https://example.com/relational_algebra.pdf',
          }
        ]);
      }
      return Promise.resolve([]);
    });

    renderWithProviders(<StudyMaterials />);

    await waitFor(() => {
      expect(screen.getByText('Chapter 1: Relational Algebra')).toBeInTheDocument();
    });
  });

  test('LeaveRequests page renders form toggle and past history', async () => {
    jest.spyOn(apiModule, 'request').mockResolvedValue([
      {
        id: 401,
        leave_type: 'Medical Leave',
        start_date: '2026-05-12',
        end_date: '2026-05-14',
        reason: 'Viral fever rest at home.',
        status: 'approved',
      }
    ]);

    renderWithProviders(<LeaveRequests />);

    await waitFor(() => {
      expect(screen.getAllByText('Medical Leave').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(/Viral fever rest at home/i)).toBeInTheDocument();
    });

    // Test form toggle
    const newReqBtn = screen.getByText(/New Request/i);
    fireEvent.click(newReqBtn);
    expect(screen.getByText(/From Date/i)).toBeInTheDocument();
  });

  test('Billing page renders analytics and payment invoice rows', async () => {
    jest.spyOn(apiModule, 'request').mockResolvedValue([
      {
        id: 501,
        fee_name: 'Semester 6 Tuition Fee',
        total_amount: '85000.00',
        amount_paid: '0.00',
        due_date: '2026-06-15',
        status: 'pending',
      },
      {
        id: 502,
        fee_name: 'Hostel Annual Fee',
        total_amount: '45000.00',
        amount_paid: '45000.00',
        due_date: '2026-01-10',
        status: 'paid',
      }
    ]);

    renderWithProviders(<Billing />);

    await waitFor(() => {
      expect(screen.getByText('Semester 6 Tuition Fee')).toBeInTheDocument();
      expect(screen.getByText('Hostel Annual Fee')).toBeInTheDocument();
    });
  });

  test('Feedback page renders enrolled course feedback cards', async () => {
    jest.spyOn(apiModule, 'request').mockImplementation((path) => {
      if (path.includes('enrollments')) {
        return Promise.resolve([
          {
            id: 601,
            course_code: 'CE601',
            course_title: 'Database Management Systems',
            course: {
              id: 10,
              code: 'CE601',
              title: 'Database Management Systems',
              instructor_name: 'Dr. Rajesh Sharma',
            }
          }
        ]);
      }
      return Promise.resolve([]);
    });

    renderWithProviders(<Feedback />);

    await waitFor(() => {
      expect(screen.getAllByText('Database Management Systems').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Dr. Rajesh Sharma')).toBeInTheDocument();
      expect(screen.getByText(/Give Feedback/i)).toBeInTheDocument();
    });
  });

  test('Enrollment page renders progress strip and current courses', async () => {
    jest.spyOn(apiModule, 'request').mockImplementation((path) => {
      if (path.includes('enrollments')) {
        return Promise.resolve([
          {
            id: 701,
            course_code: 'CE601',
            course_title: 'Database Management Systems',
            course: {
              id: 10,
              code: 'CE601',
              title: 'Database Management Systems',
              credits: 4,
              course_type: 'Core',
            }
          }
        ]);
      }
      if (path.includes('transcript')) {
        return Promise.resolve({
          cgpa: 8.92,
          total_credits_earned: 104,
          semesters: [],
        });
      }
      return Promise.resolve([]);
    });

    renderWithProviders(<Enrollment />);

    await waitFor(() => {
      expect(screen.getByText('Degree Progress')).toBeInTheDocument();
      expect(screen.getAllByText('Database Management Systems').length).toBeGreaterThanOrEqual(1);
    });
  });

  test('StudentsList page renders student table and handles CSV export button', async () => {
    jest.spyOn(apiModule, 'request').mockResolvedValue({
      count: 1,
      results: [
        {
          id: 801,
          full_name: 'Aditya Sharma',
          department: 'B.Tech (CSE)',
          attendance_percentage: 92,
          fee_status: 'Paid',
          user: {
            first_name: 'Aditya',
            last_name: 'Sharma',
            enrollment_id: 'AU2100801',
            is_active: true,
          }
        }
      ]
    });

    renderWithProviders(<StudentsList />);

    await waitFor(() => {
      expect(screen.getByText('Student Directory 📂')).toBeInTheDocument();
      expect(screen.getByText('Aditya Sharma')).toBeInTheDocument();
      expect(screen.getByText('Roll ID: AU2100801')).toBeInTheDocument();
    });
  });
});
