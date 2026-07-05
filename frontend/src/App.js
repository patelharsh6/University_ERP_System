import React, { useState } from 'react';
import './App.css';
import Layout from './components/Layout/Layout';
import Profile from './pages/student/Profile';
import Attendance from './pages/student/Attendance';
import Timetable from './pages/student/Timetable';
import Reports from './pages/student/Reports';
import Billing from './pages/student/Billing';
import Announcements from './pages/student/Announcements'; 
import Feedback from './pages/student/Feedback';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Results from './pages/student/Results';
import Dashboard from './pages/student/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import Courses from './pages/student/Courses';
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import CourseManagement from './pages/faculty/CourseManagement';
import StudentsList from './pages/admin/StudentsList';
import RegistrationForm from './pages/admin/RegistrationForm';
import Assignments from './pages/student/Assignments';
import StudyMaterials from './pages/student/StudyMaterials';
import LeaveRequests from './pages/student/LeaveRequests';
import Notifications from './pages/student/Notifications';
import Messages from './pages/student/Messages';
import Settings from './pages/student/Settings';
import Subjects from './pages/student/Subjects';
import MyInstitution from './pages/student/MyInstitution';
import ExamSchedule from './pages/student/ExamSchedule';
import Holidays from './pages/student/Holidays';
import Counselling from './pages/student/Counselling';
import Assessments from './pages/student/Assessments';
import Enrollment from './pages/student/Enrollment';
import Clearance from './pages/student/Clearance';

function App() {
  const [userRole, setUserRole] = useState('student'); // Default to 'student'

  return (
    <div className="App">
      <BrowserRouter>
        <Layout userRole={userRole} setUserRole={setUserRole}>
          <Routes>
            {/* Root Redirect */}
            <Route path="/" element={<Navigate to={`/${userRole === 'admin' ? 'a' : userRole === 'faculty' ? 'f' : 's'}/dashboard`} replace />} />

            {/* Admin Routes */}
            <Route path="/a/dashboard" element={<AdminDashboard />} />
            <Route path="/a/students" element={<StudentsList />} />
            <Route path="/a/registration" element={<RegistrationForm />} />

            {/* Faculty Routes */}
            <Route path="/f/dashboard" element={<FacultyDashboard />} />
            <Route path="/f/courses" element={<CourseManagement />} />

            {/* Student Routes */}
            <Route path="/s/dashboard" element={<Dashboard userRole="student" />} />
            <Route path="/s/profile" element={<Profile />} />
            <Route path="/s/attendance" element={<Attendance />} />
            <Route path="/s/reports" element={<Reports />} />
            <Route path="/s/timetable" element={<Timetable />} />
            <Route path="/s/billing" element={<Billing />} />
            <Route path="/s/announcements" element={<Announcements />} />
            <Route path="/s/feedback" element={<Feedback />} />
            <Route path="/s/results" element={<Results />} />
            <Route path="/s/courses" element={<Courses />} />
            <Route path="/s/assignments" element={<Assignments />} />
            <Route path="/s/materials" element={<StudyMaterials />} />
            <Route path="/s/leaves" element={<LeaveRequests />} />
            <Route path="/s/notifications" element={<Notifications />} />
            <Route path="/s/messages" element={<Messages />} />
            <Route path="/s/settings" element={<Settings />} />
            <Route path="/s/subjects" element={<Subjects />} />
            <Route path="/s/institution" element={<MyInstitution />} />
            <Route path="/s/exam-schedules" element={<ExamSchedule />} />
            <Route path="/s/holidays" element={<Holidays />} />
            <Route path="/s/counselling" element={<Counselling />} />
            <Route path="/s/assessments" element={<Assessments />} />
            <Route path="/s/enrollment" element={<Enrollment />} />
            <Route path="/s/clearance" element={<Clearance />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
