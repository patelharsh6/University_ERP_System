// src/pages/student/Notifications.jsx
import React, { useState } from 'react';
import './Notifications.css';
import {
  FiBell, FiCheckCircle, FiAlertCircle, FiBookOpen, FiInfo,
  FiCreditCard, FiCalendar, FiFilter,
  FiAward, FiRadio, FiStar, FiX, FiSearch
} from 'react-icons/fi';

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const notifData = [
  {
    id: 1,
    type: 'exam',
    category: 'Academic',
    title: 'Mid-Semester Exam Schedule Released',
    description: 'The final examination timetable for Semester VI has been released. Exams begin from March 15, 2026. Download the schedule from the Timetable section.',
    time: '2 hours ago',
    date: 'Today',
    isRead: false,
    isStarred: true,
    actionLabel: 'View Timetable',
    actionPath: '/s/timetable',
  },
  {
    id: 2,
    type: 'system',
    category: 'System',
    title: 'Scheduled System Maintenance',
    description: 'The ERP portal will be unavailable for maintenance on Sunday, July 7 from 2:00 AM – 4:00 AM. Please plan accordingly.',
    time: '5 hours ago',
    date: 'Today',
    isRead: false,
    isStarred: false,
    actionLabel: null,
  },
  {
    id: 3,
    type: 'academic',
    category: 'Academic',
    title: 'Assignment Graded: Software Reqts. Specification',
    description: 'Your assignment has been reviewed and graded. You scored 18/20. View detailed feedback in the Assignments section.',
    time: '1 day ago',
    date: 'Yesterday',
    isRead: false,
    isStarred: false,
    actionLabel: 'View Feedback',
    actionPath: '/s/assignments',
  },
  {
    id: 4,
    type: 'billing',
    category: 'Finance',
    title: 'Fee Payment Confirmation',
    description: 'Your semester fee payment of ₹45,000 has been successfully received. Your receipt has been generated. Transaction ID: TXN202600421.',
    time: '2 days ago',
    date: 'Jul 3',
    isRead: true,
    isStarred: false,
    actionLabel: 'Download Receipt',
    actionPath: '/s/billing',
  },
  {
    id: 5,
    type: 'general',
    category: 'General',
    title: 'Library Overdue Notice',
    description: '"Introduction to Algorithms" (3rd Ed.) is due for return tomorrow, July 6. Please return the book to avoid a fine of ₹10/day.',
    time: '2 days ago',
    date: 'Jul 3',
    isRead: true,
    isStarred: true,
    actionLabel: null,
  },
  {
    id: 6,
    type: 'event',
    category: 'Event',
    title: 'Tech-Fest 2026 – Registration Open!',
    description: 'Registration for Tech-Fest 2026 is now open. Join hackathons, coding contests, and robotics challenges. Early bird deadline: July 20.',
    time: '3 days ago',
    date: 'Jul 2',
    isRead: true,
    isStarred: false,
    actionLabel: 'Register Now',
    actionPath: '/s/announcements',
  },
  {
    id: 7,
    type: 'academic',
    category: 'Academic',
    title: 'New Study Material Uploaded',
    description: 'Dr. Rajesh Sharma uploaded new notes for Database Management Systems – Unit 4: Normalization. Check the Study Materials section.',
    time: '4 days ago',
    date: 'Jul 1',
    isRead: true,
    isStarred: false,
    actionLabel: 'View Materials',
    actionPath: '/s/materials',
  },
  {
    id: 8,
    type: 'result',
    category: 'Academic',
    title: 'Semester V Results Declared',
    description: 'Your Semester V examination results have been officially declared. Your CGPA for this semester is 8.7. Congratulations!',
    time: '5 days ago',
    date: 'Jun 30',
    isRead: true,
    isStarred: true,
    actionLabel: 'View Results',
    actionPath: '/s/results',
  },
];

const CATEGORIES = ['All', 'Academic', 'System', 'Finance', 'General', 'Event'];

const typeConfig = {
  exam:     { icon: FiCalendar,    color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  system:   { icon: FiAlertCircle, color: '#ef4444', bg: 'rgba(239,68,68,0.1)'  },
  academic: { icon: FiBookOpen,    color: '#2563eb', bg: 'rgba(37,99,235,0.1)'  },
  billing:  { icon: FiCreditCard,  color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  general:  { icon: FiInfo,        color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  event:    { icon: FiRadio,       color: '#ec4899', bg: 'rgba(236,72,153,0.1)' },
  result:   { icon: FiAward,       color: '#0d9488', bg: 'rgba(13,148,136,0.1)' },
};

// ─── Helper: Icon wrapper ──────────────────────────────────────────────────────
const NotifIcon = ({ type }) => {
  const cfg = typeConfig[type] || typeConfig.general;
  const IconComp = cfg.icon;
  return (
    <div className="notif-icon-wrap" style={{ background: cfg.bg, color: cfg.color }}>
      <IconComp size={18} />
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const Notifications = () => {
  const [notifications, setNotifications] = useState(notifData);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  // ── Derived data ──────────────────────────────────────────────
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filtered = notifications.filter(n => {
    const matchCat = activeCategory === 'All' || n.category === activeCategory;
    const matchUnread = !showUnreadOnly || !n.isRead;
    const matchSearch = !searchQuery ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchUnread && matchSearch;
  });

  // Group by date
  const grouped = filtered.reduce((acc, n) => {
    if (!acc[n.date]) acc[n.date] = [];
    acc[n.date].push(n);
    return acc;
  }, {});

  // ── Actions ───────────────────────────────────────────────────
  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const toggleStar = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isStarred: !n.isStarred } : n));
  };

  const dismiss = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="notifications-page">
      
      {/* ── PAGE HEADER ── */}
      <div className="notif-page-header">
        <div className="notif-title-group">
          <div className="notif-title-icon">
            <FiBell size={22} />
            {unreadCount > 0 && <span className="notif-count-badge">{unreadCount}</span>}
          </div>
          <div>
            <h1 className="notif-page-title">Notifications</h1>
            <p className="notif-subtitle">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'You\'re all caught up!'}
            </p>
          </div>
        </div>
        <div className="notif-header-actions">
          <button
            className={`notif-filter-btn ${showUnreadOnly ? 'active' : ''}`}
            onClick={() => setShowUnreadOnly(!showUnreadOnly)}
            title="Filter unread"
          >
            <FiFilter size={14} />
            {showUnreadOnly ? 'All' : 'Unread only'}
          </button>
          {unreadCount > 0 && (
            <button className="notif-mark-all-btn" onClick={markAllAsRead}>
              <FiCheckCircle size={14} />
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* ── SEARCH ── */}
      <div className="notif-search-bar">
        <FiSearch size={15} className="notif-search-icon" />
        <input
          type="text"
          placeholder="Search notifications…"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button className="notif-search-clear" onClick={() => setSearchQuery('')}>
            <FiX size={14} />
          </button>
        )}
      </div>

      {/* ── CATEGORY TABS ── */}
      <div className="notif-category-tabs">
        {CATEGORIES.map(cat => {
          const count = cat === 'All'
            ? notifications.filter(n => !n.isRead).length
            : notifications.filter(n => n.category === cat && !n.isRead).length;
          return (
            <button
              key={cat}
              className={`notif-cat-tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
              {count > 0 && <span className="tab-badge">{count}</span>}
            </button>
          );
        })}
      </div>

      {/* ── NOTIFICATION GROUPS ── */}
      <div className="notif-feed">
        {Object.keys(grouped).length === 0 ? (
          <div className="notif-empty">
            <div className="notif-empty-icon"><FiBell size={36} /></div>
            <h3>No notifications found</h3>
            <p>Try adjusting your filters or search query</p>
          </div>
        ) : (
          Object.entries(grouped).map(([date, items]) => (
            <div key={date} className="notif-date-group">
              <div className="notif-date-label">{date}</div>
              <div className="notif-group-list">
                {items.map(notif => (
                  <NotificationCard
                    key={notif.id}
                    notif={notif}
                    onRead={markAsRead}
                    onStar={toggleStar}
                    onDismiss={dismiss}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

// ─── Notification Card ─────────────────────────────────────────────────────────
const NotificationCard = ({ notif, onRead, onStar, onDismiss }) => {
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    if (!notif.isRead) onRead(notif.id);
    setExpanded(!expanded);
  };

  return (
    <div
      className={`notif-card ${!notif.isRead ? 'unread' : ''} ${notif.isStarred ? 'starred' : ''}`}
      onClick={handleClick}
    >
      {/* Unread indicator strip */}
      {!notif.isRead && <div className="notif-unread-strip" />}

      <div className="notif-card-inner">
        {/* Icon */}
        <NotifIcon type={notif.type} />

        {/* Content */}
        <div className="notif-content">
          <div className="notif-content-header">
            <div className="notif-tag-row">
              <span className={`notif-category-tag cat-${notif.type}`}>{notif.category}</span>
              {!notif.isRead && <span className="new-dot-label">NEW</span>}
            </div>
            <span className="notif-time">{notif.time}</span>
          </div>

          <h3 className={`notif-title ${!notif.isRead ? 'unread-title' : ''}`}>
            {notif.title}
          </h3>

          <p className={`notif-desc ${expanded ? 'expanded' : ''}`}>
            {notif.description}
          </p>

          {/* Action button */}
          {expanded && notif.actionLabel && (
            <button className="notif-action-btn" onClick={e => e.stopPropagation()}>
              {notif.actionLabel} →
            </button>
          )}
        </div>

        {/* Card Actions */}
        <div className="notif-card-actions" onClick={e => e.stopPropagation()}>
          <button
            className={`notif-action-icon star ${notif.isStarred ? 'starred' : ''}`}
            onClick={() => onStar(notif.id)}
            title={notif.isStarred ? 'Unstar' : 'Star'}
          >
            <FiStar size={14} />
          </button>
          <button
            className="notif-action-icon dismiss"
            onClick={() => onDismiss(notif.id)}
            title="Dismiss"
          >
            <FiX size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
