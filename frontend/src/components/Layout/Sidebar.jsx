// src/components/Layout/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Layout.css';
import { menuConfig } from './menuConfig';

const Sidebar = ({ isOpen, isCollapsed, toggleCollapse, toggleSidebar }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <NavLink to="/" className="sidebar-brand">
          <div className="sidebar-logo-icon">U</div>
          <span className="sidebar-brand-text">UNIV ERP</span>
        </NavLink>
      </div>

      {/* Menu Items */}
      <div className="sidebar-menu">
        {menuConfig.map((group, index) => (
          <div key={index}>
            {/* Category Label (e.g. ACADEMICS) */}
            {group.category && <div className="menu-category">{group.category}</div>}
            
            {/* Items in that category */}
            {group.items.map((item, idx) => (
              <NavLink 
                to={item.path} 
                end={item.path === "/"}
                className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
                key={idx}
                onClick={toggleSidebar} // Close on mobile when clicked
              >
                <div className="menu-item-content">
                  {item.icon}
                  <span>{item.title}</span>
                </div>
                {item.badge && (
                  <span className={`menu-badge ${item.badgeType || 'danger'}`}>
                    {item.badge}
                  </span>
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
        {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
      </button>
    </aside>
  );
};

export default Sidebar;

