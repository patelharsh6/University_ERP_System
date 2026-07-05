// src/components/Layout/TopNavbar.jsx
import React, { useState, useEffect } from 'react';
import { FaBars, FaBell, FaSun, FaMoon, FaSearch, FaChevronRight } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import './Layout.css';
import Badge from '../ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';

const TopNavbar = ({ toggleSidebar, userRole, setUserRole, isDarkMode, toggleDarkMode }) => {
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const location = useLocation();

  // Handle Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setShowCommandPalette(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Format path for breadcrumb
  const pathParts = location.pathname.split('/').filter(Boolean);
  const currentPage = pathParts.length > 0 
    ? pathParts[pathParts.length - 1].charAt(0).toUpperCase() + pathParts[pathParts.length - 1].slice(1)
    : 'Dashboard';

  return (
    <>
      <header className="top-navbar premium-glass">
        <div className="nav-left">
          <button className="icon-btn" onClick={toggleSidebar} id="mobile-menu-btn">
            <FaBars />
          </button>
          
          <div className="nav-breadcrumbs">
            <span className="breadcrumb-item text-muted">Home</span>
            <FaChevronRight className="breadcrumb-separator" />
            <span className="breadcrumb-item font-semibold">{currentPage}</span>
          </div>

          <div 
            className="command-palette-trigger"
            onClick={() => setShowCommandPalette(true)}
          >
            <FaSearch className="text-muted" />
            <span className="search-placeholder">Search or jump to...</span>
            <span className="shortcut-key">⌘K</span>
          </div>
        </div>

        <div className="nav-right">
          {/* Notifications */}
          <button className="icon-btn" title="Notifications">
            <FaBell size={14} />
            <div className="icon-btn-dot" />
          </button>

          {/* Theme Toggle Button */}
          <button 
            className="icon-btn" 
            onClick={toggleDarkMode} 
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <FaSun size={14} style={{ color: '#F59E0B' }} /> : <FaMoon size={14} />}
          </button>

          <div className="nav-divider" />

          {/* Role Switcher (Testing Tool) */}
          <select 
            value={userRole} 
            onChange={(e) => {
              setUserRole(e.target.value);
              // Force navigation to the new role's dashboard to ensure correct display
              window.location.href = `/${e.target.value === 'admin' ? 'a' : e.target.value === 'faculty' ? 'f' : 's'}/dashboard`;
            }}
            style={{ 
              background: 'var(--surface-color)', 
              color: 'var(--text-primary)', 
              border: '1px solid var(--card-border)', 
              borderRadius: 'var(--radius-sm)', 
              padding: '6px 8px', 
              outline: 'none',
              fontFamily: 'var(--font-family)',
              fontSize: 'var(--text-sm)',
              cursor: 'pointer',
              marginRight: '8px'
            }}
            title="Switch User Role"
          >
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="admin">Admin</option>
          </select>

          <div className="nav-divider" />
          
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

      {/* Command Palette Modal */}
      <AnimatePresence>
        {showCommandPalette && (
          <motion.div 
            className="command-palette-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCommandPalette(false)}
          >
            <motion.div 
              className="command-palette-modal"
              initial={{ scale: 0.95, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="command-palette-header">
                <FaSearch className="text-muted" />
                <input 
                  type="text" 
                  placeholder="Search students, courses, documents..." 
                  autoFocus
                />
                <Badge variant="default" className="esc-badge">ESC</Badge>
              </div>
              <div className="command-palette-body">
                <div className="command-group-title">Suggestions</div>
                <div className="command-item">
                  <span className="command-item-icon">👤</span> Go to Profile
                </div>
                <div className="command-item">
                  <span className="command-item-icon">⚙️</span> Settings
                </div>
                <div className="command-item">
                  <span className="command-item-icon">📊</span> View Results
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TopNavbar;