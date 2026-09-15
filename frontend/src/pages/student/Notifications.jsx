// src/pages/student/Notifications.jsx
import React, { useState, useEffect } from 'react';
import './Notifications.css';
import {
  FiBell, FiCheckCircle, FiAlertCircle, FiBookOpen, FiInfo,
  FiCreditCard, FiCalendar, FiFilter,
  FiAward, FiRadio, FiStar, FiX, FiSearch
} from 'react-icons/fi';
import { useApi } from '../../hooks/useApi';
import { endpoints } from '../../services/endpoints';
import { api } from '../../services/api';
import { formatDate } from '../../utils/format';
import Skeleton from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';

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
  const { data: rawNotifs, loading, error, refetch } = useApi(endpoints.announcements.notifications, {
    params: { page_size: 100 }
  });

  const [notifications, setNotifications] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  useEffect(() => {
    if (rawNotifs) {
      const list = Array.isArray(rawNotifs) ? rawNotifs : (rawNotifs.results || []);
      const mapped = list.map(item => {
        let type = 'general';
        let category = 'General';
        if (item.notification_type === 'warning') {
          type = 'exam';
          category = 'Academic';
        } else if (item.notification_type === 'error') {
          type = 'system';
          category = 'System';
        } else if (item.notification_type === 'success') {
          type = 'result';
          category = 'Academic';
        }

        const createdDate = item.created_at ? new Date(item.created_at) : new Date();
        const isToday = createdDate.toDateString() === new Date().toDateString();
        const dateLabel = isToday ? 'Today' : formatDate(item.created_at);

        return {
          id: item.id,
          type,
          category,
          title: item.title,
          description: item.message,
          time: formatDate(item.created_at),
          date: dateLabel,
          isRead: Boolean(item.is_read),
          isStarred: false,
          actionLabel: item.link ? 'Open Link' : null,
          actionPath: item.link || null,
        };
      });
      setNotifications(mapped);
    }
  }, [rawNotifs]);

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
  const markAsRead = async (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    try {
      await api.patch(endpoints.announcements.notificationDetail(id), { is_read: true });
    } catch {
      // Keep optimistic update
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.isRead);
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    await Promise.allSettled(
      unread.map(n => api.patch(endpoints.announcements.notificationDetail(n.id), { is_read: true }))
    );
  };

  const toggleStar = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isStarred: !n.isStarred } : n));
  };

  const dismiss = async (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    try {
      await api.delete(endpoints.announcements.notificationDetail(id));
    } catch {
      // Ignored
    }
  };

  if (loading) {
    return (
      <div className="notifications-page" style={{ padding: '24px' }}>
        <Skeleton variant="card" height={70} style={{ marginBottom: '20px' }} />
        <Skeleton variant="card" height={40} style={{ marginBottom: '20px' }} />
        <Skeleton variant="card" height={100} style={{ marginBottom: '12px' }} />
        <Skeleton variant="card" height={100} style={{ marginBottom: '12px' }} />
        <Skeleton variant="card" height={100} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="notifications-page" style={{ padding: '24px' }}>
        <ErrorState error={error} onRetry={refetch} />
      </div>
    );
  }

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
          <EmptyState
            icon={FiBell}
            title="No Notifications Found"
            description="You have no notifications matching your search or active filter."
          />
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
          {expanded && notif.actionLabel && notif.actionPath && (
            <a 
              href={notif.actionPath}
              className="notif-action-btn" 
              onClick={e => e.stopPropagation()}
              style={{ display: 'inline-block', textDecoration: 'none' }}
            >
              {notif.actionLabel} →
            </a>
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
  );
};

export default Notifications;

