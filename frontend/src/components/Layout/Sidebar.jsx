// src/components/Layout/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaRegClock, FaThumbtack } from 'react-icons/fa';
import './Layout.css';
import { menuConfig } from './menuConfig';
import Badge from '../ui/Badge';
import { motion } from 'framer-motion';

const Sidebar = ({ isOpen, isCollapsed, toggleCollapse, toggleSidebar }) => {
  return (
    <motion.aside
      className={`sidebar ${isOpen ? 'mobile-open' : ''} ${isCollapsed ? 'collapsed' : ''}`}
      animate={{ width: isCollapsed ? 80 : 260 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <NavLink to="/" className="sidebar-brand">
          <div className="sidebar-logo-icon">U</div>
          {!isCollapsed && (
            <motion.span
              className="sidebar-brand-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              UNIV ERP
            </motion.span>
          )}
        </NavLink>
      </div>

      {/* Menu Items */}
      <div className="sidebar-menu custom-scrollbar">

        {/* Pinned / Recent section (Linear style) */}
        {!isCollapsed && (
          <div className="sidebar-quick-links">
            <div className="quick-link-item">
              <FaThumbtack className="text-muted" size={12} />
              <span>Computer Networks CS304</span>
            </div>
            <div className="quick-link-item">
              <FaRegClock className="text-muted" size={12} />
              <span>Mid-Term Results</span>
            </div>
          </div>
        )}

        {menuConfig.map((group, index) => (
          <div key={index} className="menu-group">
            {/* Category Label (e.g. ACADEMICS) */}
            {group.category && !isCollapsed && (
              <motion.div
                className="menu-category"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {group.category}
              </motion.div>
            )}

            {/* Items in that category */}
            {group.items.map((item, idx) => (
              <NavLink
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
                key={idx}
                onClick={toggleSidebar} // Close on mobile when clicked
                title={isCollapsed ? item.title : undefined}
              >
                <div className="menu-item-content">
                  <span className="menu-icon">{item.icon}</span>
                  {!isCollapsed && (
                    <motion.span
                      className="menu-text"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {item.title}
                    </motion.span>
                  )}
                </div>
                {!isCollapsed && item.badge && (
                  <Badge variant={item.badgeType || 'danger'} className="menu-badge-custom">
                    {item.badge}
                  </Badge>
                )}
                {isCollapsed && item.badge && (
                  <div className="menu-badge-dot"></div>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </div>

      {/* Collapse Toggle Button (visible on desktop) */}
      <button
        className="collapse-toggle-btn"
        onClick={toggleCollapse}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <FaChevronRight size={12} /> : <FaChevronLeft size={12} />}
      </button>
    </motion.aside>
  );
};

export default Sidebar;

