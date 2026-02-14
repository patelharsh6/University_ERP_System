import logo from './logo.svg';
import './App.css';
import Navbar from './components/Layout/Layout';
import Layout from './components/Layout/Layout';
import Profile from './pages/Profile';
import Attendance from './pages/Attendance';
import Timetable from './pages/Timetable';
import Reports from './pages/Reports';
import Billing from './pages/Billing';
import Announcements from './pages/Announcements'; 
import Feedback from './pages/Feedback';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Results from './pages/Results';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="App">
      <Layout >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile"  element={<Profile />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/timetable" element={<Timetable />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        
        </BrowserRouter>
      </Layout>
      
      
    </div>
  );
}

export default App;
