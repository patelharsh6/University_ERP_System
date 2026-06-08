// src/pages/student/Notifications.jsx
import React, { useState } from 'react';
import './Notifications.css';
import { FiBell, FiCheckCircle, FiAlertCircle, FiBookOpen, FiInfo } from 'react-icons/fi';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'system',
      title: 'Scheduled Maintenance',
      description: 'The ERP system will be down for maintenance this Sunday from 2:00 AM to 4:00 AM.',
      time: '2 hours ago',
      isRead: false
    },
    {
      id: 2,
      type: 'academic',
      title: 'Assignment Graded',
      description: 'Your assignment "Software Requirements Specification" has been graded. You scored 18/20.',
      time: '5 hours ago',
      isRead: false
    },
    {
      id: 3,
      type: 'general',
      title: 'Library Overdue Notice',
      description: 'The book "Introduction to Algorithms" is due tomorrow. Please return it to avoid fines.',
      time: '1 day ago',
      isRead: true
    },
    {
      id: 4,
      type: 'academic',
      title: 'Exam Timetable Released',
      description: 'The final examination timetable for Semester 6 has been released. Check the timetable section.',
      time: '2 days ago',
      isRead: true
    }
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const getIcon = (type) => {
    switch(type) {
      case 'system': return <FiAlertCircle />;
      case 'academic': return <FiBookOpen />;
      case 'general': return <FiInfo />;
      default: return <FiBell />;
    }
  };

  return (
    <div className="notifications-container">
      
      <div className="notifications-header">
        <h1><FiBell style={{ color: 'var(--notif-accent)' }} /> Notifications</h1>
        <button className="btn-mark-read" onClick={markAllAsRead}>
          <FiCheckCircle /> Mark all as read
        </button>
      </div>

      <div className="notif-list">
        {notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--notif-text-muted)' }}>
            You have no notifications.
          </div>
        ) : (
          notifications.map(notif => (
            <div key={notif.id} className={`notif-card ${!notif.isRead ? 'unread' : ''}`}>
              <div className={`notif-icon ${notif.type}`}>
                {getIcon(notif.type)}
              </div>
              <div className="notif-info">
                <h3 className="notif-title">{notif.title}</h3>
                <p className="notif-desc">{notif.description}</p>
                <div className="notif-meta">
                  {notif.time}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default Notifications;
