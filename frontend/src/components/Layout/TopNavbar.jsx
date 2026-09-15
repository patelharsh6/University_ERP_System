// src/components/Layout/TopNavbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  FaBars,
  FaBell,
  FaSun,
  FaMoon,
  FaSearch,
  FaChevronRight,
  FaUser,
  FaCog,
  FaSignOutAlt,
} from 'react-icons/fa';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import StatusPill from '../ui/StatusPill';
import Badge from '../ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';
import './Layout.css';

const TopNavbar = ({ toggleSidebar, isDarkMode, toggleDarkMode }) => {
  const { user, role, logout } = useAuth();
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Close profile dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleLogout = async () => {
    setShowProfileMenu(false);
    await logout();
    navigate('/login', { replace: true });
  };

  // Format path for breadcrumb
  const pathParts = location.pathname.split('/').filter(Boolean);
  const currentPage =
    pathParts.length > 0
      ? pathParts[pathParts.length - 1].charAt(0).toUpperCase() +
        pathParts[pathParts.length - 1].slice(1).replace('-', ' ')
      : 'Dashboard';

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  const profileLink = role === 'student' ? '/s/profile' : `/${role === 'admin' ? 'a' : 'f'}/dashboard`;

  return (
    <>
      <header className="top-navbar premium-glass">
        <div className="nav-left">
          <button className="icon-btn" onClick={toggleSidebar} id="mobile-menu-btn" aria-label="Toggle menu">
            <FaBars />
          </button>

          <div className="nav-breadcrumbs">
            <span className="breadcrumb-item text-muted">Home</span>
            <FaChevronRight className="breadcrumb-separator" />
            <span className="breadcrumb-item font-semibold">{currentPage}</span>
          </div>

          <div className="command-palette-trigger" onClick={() => setShowCommandPalette(true)}>
            <FaSearch className="text-muted" />
            <span className="search-placeholder">Search or jump to...</span>
            <span className="shortcut-key">⌘K</span>
          </div>
        </div>

        <div className="nav-right">
          {/* Notifications */}
          <Link
            to={role === 'student' ? '/s/notifications' : '#'}
            className="icon-btn"
            title="Notifications"
            style={{ color: 'inherit' }}
          >
            <FaBell size={14} />
            <div className="icon-btn-dot" />
          </Link>

          {/* Theme Toggle Button */}
          <button
            className="icon-btn"
            onClick={toggleDarkMode}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <FaSun size={14} style={{ color: '#F59E0B' }} /> : <FaMoon size={14} />}
          </button>

          <div className="nav-divider" />

          {/* Profile Dropdown Container */}
          <div className="profile-dropdown-container" ref={profileMenuRef}>
            <button
              className="profile-dropdown-btn"
              onClick={() => setShowProfileMenu((prev) => !prev)}
              aria-expanded={showProfileMenu}
            >
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name || 'User'} className="profile-avatar" />
              ) : (
                <div className="profile-avatar-fallback">{userInitials}</div>
              )}
              <div className="profile-info">
                <span className="profile-name">{user?.name || 'Authorized User'}</span>
                <span className="profile-role">{role || 'student'}</span>
              </div>
            </button>

            {/* Interactive Dropdown Menu */}
            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  className="profile-dropdown-menu"
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="profile-menu-header">
                    <p className="profile-menu-name">{user?.name || 'Authorized User'}</p>
                    <p className="profile-menu-email">{user?.email || `${role || 'user'}@university.edu`}</p>
                    <div className="profile-menu-role-tag">
                      <StatusPill status={role || 'student'} size="sm" />
                    </div>
                  </div>

                  <div className="profile-menu-divider" />

                  <div className="profile-menu-body">
                    <Link
                      to={profileLink}
                      className="profile-menu-item"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <FaUser size={13} className="text-muted" />
                      <span>My Profile</span>
                    </Link>

                    {role === 'student' && (
                      <Link
                        to="/s/settings"
                        className="profile-menu-item"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <FaCog size={13} className="text-muted" />
                        <span>Settings</span>
                      </Link>
                    )}

                    <button
                      type="button"
                      className="profile-menu-item logout-item"
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt size={13} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
              onClick={(e) => e.stopPropagation()}
            >
              <div className="command-palette-header">
                <FaSearch className="text-muted" />
                <input type="text" placeholder="Search students, courses, documents..." autoFocus />
                <Badge variant="default" className="esc-badge">
                  ESC
                </Badge>
              </div>
              <div className="command-palette-body">
                <div className="command-group-title">Suggestions</div>
                <div
                  className="command-item"
                  onClick={() => {
                    setShowCommandPalette(false);
                    navigate(profileLink);
                  }}
                >
                  <span className="command-item-icon">👤</span> Go to Profile
                </div>
                <div
                  className="command-item"
                  onClick={() => {
                    setShowCommandPalette(false);
                    navigate(role === 'student' ? '/s/results' : `/${role === 'admin' ? 'a' : 'f'}/dashboard`);
                  }}
                >
                  <span className="command-item-icon">📊</span> View Results
                </div>
                <div
                  className="command-item"
                  onClick={() => {
                    setShowCommandPalette(false);
                    navigate(role === 'student' ? '/s/timetable' : `/${role === 'admin' ? 'a' : 'f'}/dashboard`);
                  }}
                >
                  <span className="command-item-icon">📅</span> Academic Timetable
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