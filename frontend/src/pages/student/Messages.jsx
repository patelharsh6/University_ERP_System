// src/pages/student/Messages.jsx
import React from 'react';
import './Messages.css';
import { FiMessageSquare, FiClock } from 'react-icons/fi';

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const messagesData = [
  {
    id: 1,
    sender: 'Kamleshkumar Patel',
    avatar: 'https://i.pravatar.cc/150?img=11', // Placeholder avatar
    initials: 'KP',
    body: `Faculty Feedback Review – I – Even Semester of AY 2025-26
Dear Students, This is to inform you that the Mid-Semester Feedback process (Feedback Review-I) is now active through the ERP portal. (Login to MyCamu -> Feedback menu) The feedback window will remain open from 9th February to 12th February 2026. You are required to log in to the ERP system and complete the feedback submission within this period. Please note that the ERP portal will be automatically locked after 11th February 2026, and no requests for reopening shall be entertained thereafter. Students are therefore strongly advised to complete the process well within the stipulated timeline to avoid any inconvenience. Submission of feedback is an essential academic requirement, and non-compliance may lead to serious academic consequences as per the university regulations. For any technical issues related to ERP access, please contact us immediately.`,
    time: '09-Feb-2026, 10:52 AM',
  },
  {
    id: 2,
    sender: 'Kamleshkumar Patel',
    avatar: 'https://i.pravatar.cc/150?img=11',
    initials: 'KP',
    body: `Online payment gateway is active NOW.
Dear Students, The fee payment link is now active on your portal. Kindly clear your pending dues before the 15th of February to avoid late fees.`,
    time: '05-Feb-2026, 02:15 PM',
  },
  {
    id: 3,
    sender: 'Admin Office',
    avatar: null,
    avatarColor: '#2563eb',
    initials: 'AO',
    body: `Holiday Announcement
Dear Students, The university will remain closed on 14th February 2026 on account of Vasant Panchami. Regular classes will resume from 15th February.`,
    time: '01-Feb-2026, 11:30 AM',
  },
  {
    id: 4,
    sender: 'Examination Cell',
    avatar: null,
    avatarColor: '#ef4444',
    initials: 'EC',
    body: `Mid-Term Examination Guidelines
All students must carry their physical ID cards during the examination. Electronic devices including smartwatches are strictly prohibited inside the examination hall. Please report to your assigned rooms 15 minutes before the commencement of the exam.`,
    time: '28-Jan-2026, 04:00 PM',
  }
];

// ─── Avatar Component ──────────────────────────────────────────────────────────
const Avatar = ({ msg, size = 60 }) => {
  if (msg.avatar) {
    return (
      <img 
        src={msg.avatar} 
        alt={msg.sender} 
        className="feed-avatar-img"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="feed-avatar-text"
      style={{
        width: size,
        height: size,
        background: msg.avatarColor || '#0d9488',
        fontSize: size * 0.35,
      }}
    >
      {msg.initials}
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const Messages = () => {
  return (
    <div className="messages-feed-page">
      <div className="messages-feed-header">
        <div className="feed-header-icon">
          <FiMessageSquare size={22} />
        </div>
        <div>
          <h1 className="feed-page-title">Messages</h1>
          <p className="feed-page-subtitle">Official communications and alerts</p>
        </div>
      </div>

      <div className="messages-feed-list">
        {messagesData.map(msg => (
          <div key={msg.id} className="feed-message-card">
            <div className="feed-card-avatar-col">
              <Avatar msg={msg} />
            </div>
            <div className="feed-card-content-col">
              <h3 className="feed-sender-name">{msg.sender}</h3>
              <p className="feed-message-body">{msg.body}</p>
              <div className="feed-message-time">
                <FiClock size={12} />
                {msg.time}
              </div>
            </div>
          </div>
        ))}
        {messagesData.length === 0 && (
          <div className="feed-empty-state">
            <FiMessageSquare size={40} />
            <p>No messages available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
