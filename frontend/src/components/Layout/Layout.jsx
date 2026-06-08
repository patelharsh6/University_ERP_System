// src/components/Layout/Layout.jsx
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import './Layout.css';

const Layout = ({ children, userRole, setUserRole }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Persist collapsed state to localStorage
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sidebar-collapsed') === 'true';
  });

  // Persist dark mode to localStorage
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('dark-theme') === 'true';
  });

  // Toggle Function for mobile drawer
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Toggle Function for desktop sidebar collapse
  const toggleCollapse = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('sidebar-collapsed', String(next));
      return next;
    });
  };

  // Toggle Function for dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('dark-theme', String(next));
      return next;
    });
  };

  return (
    <div className={`app-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''} ${isDarkMode ? 'dark-theme' : ''}`}>
      {/* Sidebar with Mobile and Collapse Logic */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={toggleCollapse}
        toggleSidebar={() => setIsSidebarOpen(false)} // Close when item clicked
      />

      {/* Overlay for Mobile (Click to close sidebar) */}
      {isSidebarOpen && (
        <div className="overlay" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Main Area */}
      <div className="main-content">
        <TopNavbar 
          toggleSidebar={toggleSidebar} 
          userRole={userRole}
          setUserRole={setUserRole}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />

        {/* Dynamic Content */}
        <div className="content-wrapper">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;