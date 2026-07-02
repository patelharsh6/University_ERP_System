// src/components/Layout/TopNavbar.jsx
import React, { useState, useEffect } from 'react';
import { FaBars, FaBell, FaSun, FaMoon, FaSearch, FaPlus, FaCommentAlt, FaChevronRight } from 'react-icons/fa';
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
          {/* Selectors */}
          <div className="nav-selectors">
            <select className="nav-select-dropdown">
              <option>Main Campus</option>
              <option>North Campus</option>
            </select>
            <select className="nav-select-dropdown">
              <option>2026-27</option>
              <option>2025-26</option>
            </select>
            <select className="nav-select-dropdown">
              <option>Fall Sem</option>
              <option>Spring Sem</option>
            </select>
          </div>

          <div className="nav-divider" />

          {/* Quick Create */}
          <button className="icon-btn" title="Quick Create">
            <FaPlus size={14} />
          </button>

          {/* Messages */}
          <button className="icon-btn" title="Messages">
            <FaCommentAlt size={14} />
          </button>

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