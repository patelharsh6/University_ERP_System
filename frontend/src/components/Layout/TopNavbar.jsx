// src/components/Layout/TopNavbar.jsx
import React from 'react';
import { FaBars, FaBell, FaSun, FaMoon, FaSearch } from 'react-icons/fa';
import './Layout.css';

const TopNavbar = ({ toggleSidebar, userRole, setUserRole, isDarkMode, toggleDarkMode }) => {
  return (
    <header className="top-navbar">
      <div className="nav-left">
        <button className="icon-btn" onClick={toggleSidebar} style={{ display: 'none' }} id="mobile-menu-btn">
          <FaBars />
        </button>
        <div className="global-search-container">
          <FaSearch />
          <input 
            type="text" 
            placeholder="Search students, courses, documents..." 
            className="global-search-input"
          />
        </div>
      </div>

      <div className="nav-right">
        {/* Role Selector dropdown */}
        <select 
          value={userRole} 
          onChange={(e) => setUserRole(e.target.value)}
          className="role-select-dropdown"
        >
          <option value="student">🎓 Student View</option>
          <option value="faculty">👨‍🏫 Faculty View</option>
          <option value="admin">⚙️ Admin Analytics</option>
        </select>

        {/* Theme Toggle Button */}
        <button 
          className="icon-btn" 
          onClick={toggleDarkMode} 
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <FaSun size={16} style={{ color: '#F59E0B' }} /> : <FaMoon size={16} />}
        </button>

        {/* Notification Icon */}
        <button className="icon-btn" title="Notifications">
          <FaBell size={16} />
          <div className="icon-btn-dot" />
        </button>
        
        {/* Profile Dropdown */}
        <button className="profile-dropdown-btn">
          <img src="https://i.pravatar.cc/150?u=harsh" alt="Profile" className="profile-avatar" />
          <div className="profile-info">
            <span className="profile-name">
              {userRole === 'student' ? 'Harsh Patel' : userRole === 'faculty' ? 'Prof. Sharma' : 'ERP Director'}
            </span>
            <span className="profile-role">{userRole}</span>
          </div>
        </button>
      </div>
    </header>
  );
};

export default TopNavbar;