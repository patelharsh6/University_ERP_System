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
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Results from './pages/student/Results';
import Dashboard from './pages/student/Dashboard';
import Courses from './components/course_c/CoursesPage';
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import CourseManagement from './pages/faculty/CourseManagement';
import StudentsList from './pages/student/StudentsList';
import RegistrationForm from './pages/student/RegistrationForm';

function App() {
  const [userRole, setUserRole] = useState('admin'); // Default to 'admin' to show premium SaaS metrics

  return (
    <div className="App">
      <BrowserRouter>
        <Layout userRole={userRole} setUserRole={setUserRole}>
          <Routes>
            <Route path="/" element={<Dashboard userRole={userRole} />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/timetable" element={<Timetable />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/results" element={<Results />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/students" element={<StudentsList />} />
            <Route path="/registration" element={<RegistrationForm />} />
            <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
            <Route path="/course-management" element={<CourseManagement />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
