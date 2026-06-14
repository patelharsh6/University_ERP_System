// src/components/Layout/TopNavbar.jsx
import React from 'react';
import { FaBars, FaBell, FaSun, FaMoon } from 'react-icons/fa';
import './Layout.css';

const TopNavbar = ({ toggleSidebar, userRole, setUserRole, isDarkMode, toggleDarkMode }) => {
  return (
    <header className="top-navbar">
      {/* LEFT: Only visible on mobile (controlled by CSS) */}
      <div className="nav-left">
        <button className="hamburger-btn" onClick={toggleSidebar}>
          <FaBars />
        </button>
      </div>

      {/* RIGHT: Always visible (Profile & Icons) */}
      <div className="nav-right">
        {/* Role Selector dropdown */}
        <div className="role-switcher-container">
          <select 
            value={userRole} 
            onChange={(e) => setUserRole(e.target.value)}
            className="role-select-dropdown"
          >
            <option value="student">🎓 Student View</option>
            <option value="faculty">👨‍🏫 Faculty View</option>
            <option value="admin">⚙️ Admin Analytics</option>
          </select>
        </div>

        {/* Theme Toggle Button */}
        <button 
          className="icon-btn" 
          onClick={toggleDarkMode} 
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <FaSun size={18} style={{ color: '#F59E0B' }} /> : <FaMoon size={18} />}
        </button>

        {/* Notification Icon */}
        <div className="icon-btn" title="Notifications">
          <FaBell size={18} />
          <div className="icon-btn-dot" />
        </div>
        
        {/* Profile Dropdown */}
        <div className="profile-box">
          <div className="profile-img">
            {/* Using CSS background image for avatar */}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="profile-name-text" style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              {userRole === 'student' ? 'Harsh Patel' : userRole === 'faculty' ? 'Prof. Sharma' : 'ERP Director'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;