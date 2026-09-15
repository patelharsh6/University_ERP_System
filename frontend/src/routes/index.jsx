// src/routes/index.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import { useAuth } from '../context/AuthContext';

// Auth & Shared Pages
import Login from '../pages/auth/Login';
import Forbidden from '../pages/shared/Forbidden';
import NotFound from '../pages/shared/NotFound';

// Student Pages
import Dashboard from '../pages/student/Dashboard';
import Profile from '../pages/student/Profile';
import Attendance from '../pages/student/Attendance';
import Timetable from '../pages/student/Timetable';
import Courses from '../pages/student/Courses';
import Subjects from '../pages/student/Subjects';
import Assignments from '../pages/student/Assignments';
import StudyMaterials from '../pages/student/StudyMaterials';
import Results from '../pages/student/Results';
import Billing from '../pages/student/Billing';
import Announcements from '../pages/student/Announcements';
import Notifications from '../pages/student/Notifications';
import LeaveRequests from '../pages/student/LeaveRequests';
import Feedback from '../pages/student/Feedback';
import Enrollment from '../pages/student/Enrollment';
import Clearance from '../pages/student/Clearance';
import MyInstitution from '../pages/student/MyInstitution';
import ExamSchedule from '../pages/student/ExamSchedule';
import Holidays from '../pages/student/Holidays';
import Counselling from '../pages/student/Counselling';
import Assessments from '../pages/student/Assessments';
import Reports from '../pages/student/Reports';
import Messages from '../pages/student/Messages';
import Settings from '../pages/student/Settings';

// Faculty Pages
import FacultyDashboard from '../pages/faculty/FacultyDashboard';
import CourseManagement from '../pages/faculty/CourseManagement';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import StudentsList from '../pages/admin/StudentsList';
import RegistrationForm from '../pages/admin/RegistrationForm';

// Root Redirect component to direct user to their role dashboard
const RootRedirect = () => {
  const { role, isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  const defaultPath = `/${role === 'admin' ? 'a' : role === 'faculty' ? 'f' : 's'}/dashboard`;
  return <Navigate to={defaultPath} replace />;
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Root & Auth Routes */}
      <Route path="/" element={<RootRedirect />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route path="/403" element={<Forbidden />} />
      <Route path="/404" element={<NotFound />} />

      {/* Student Routes */}
      <Route element={<ProtectedRoute allowedRoles={['student', 'admin']} />}>
        <Route path="/s/dashboard" element={<Dashboard userRole="student" />} />
        <Route path="/s/profile" element={<Profile />} />
        <Route path="/s/attendance" element={<Attendance />} />
        <Route path="/s/timetable" element={<Timetable />} />
        <Route path="/s/courses" element={<Courses />} />
        <Route path="/s/subjects" element={<Subjects />} />
        <Route path="/s/assignments" element={<Assignments />} />
        <Route path="/s/materials" element={<StudyMaterials />} />
        <Route path="/s/results" element={<Results />} />
        <Route path="/s/billing" element={<Billing />} />
        <Route path="/s/announcements" element={<Announcements />} />
        <Route path="/s/notifications" element={<Notifications />} />
        <Route path="/s/leaves" element={<LeaveRequests />} />
        <Route path="/s/feedback" element={<Feedback />} />
        <Route path="/s/enrollment" element={<Enrollment />} />
        <Route path="/s/clearance" element={<Clearance />} />
        <Route path="/s/institution" element={<MyInstitution />} />
        <Route path="/s/exam-schedules" element={<ExamSchedule />} />
        <Route path="/s/holidays" element={<Holidays />} />
        <Route path="/s/counselling" element={<Counselling />} />
        <Route path="/s/assessments" element={<Assessments />} />
        <Route path="/s/reports" element={<Reports />} />
        <Route path="/s/messages" element={<Messages />} />
        <Route path="/s/settings" element={<Settings />} />
      </Route>

      {/* Faculty Routes */}
      <Route element={<ProtectedRoute allowedRoles={['faculty', 'admin']} />}>
        <Route path="/f/dashboard" element={<FacultyDashboard />} />
        <Route path="/f/courses" element={<CourseManagement />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/a/dashboard" element={<AdminDashboard />} />
        <Route path="/a/students" element={<StudentsList />} />
        <Route path="/a/registration" element={<RegistrationForm />} />
      </Route>

      {/* Catch-All Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
