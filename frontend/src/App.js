import logo from './logo.svg';
import './App.css';
import Navbar from './components/Layout/Layout';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Attendance from './pages/Attendance';
import Timetable from './pages/Timetable';
import Reports from './pages/Reports';
import Billing from './pages/Billing';
import Announcements from './pages/Announcements'; 
import Feedback from './pages/Feedback';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Layout >
        <BrowserRouter>
          <Routes>
            {/* <Route path="/" element={<Profile />} /> */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/timetable" element={<Timetable />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/announcements" element={<Announcements />} />
          </Routes>
        
        </BrowserRouter>
        <Feedback />
      </Layout>
      
      
    </div>
  );
}

export default App;
