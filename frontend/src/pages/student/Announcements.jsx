// src/pages/Announcements.jsx
import React, { useState } from 'react';
import './Announcements.css';
import { 
  FaBullhorn, FaPlus, FaThumbtack, FaPaperclip, FaCalendarAlt, 
  FaTimes, FaDownload 
} from 'react-icons/fa';

const Announcements = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  // --- MOCK DATA ---
  const announcementsData = [
    {
      id: 1,
      title: "Mid-Semester Examination Schedule Declared",
      preview: "The finalized timetable for the Winter 2026 Mid-Sem exams has been published. Exams start from...",
      content: "The finalized timetable for the Winter 2026 Mid-Sem exams has been published. Exams start from March 15th. Please download the attached PDF for the detailed seating arrangement and subject-wise slots. Students are requested to carry their ID cards.",
      author: "Examination Cell",
      date: "12 Feb 2026",
      category: "Exam",
      isPinned: true,
      isNew: true,
      hasAttachment: true
    },
    {
      id: 2,
      title: "Campus Wi-Fi Maintenance",
      preview: "Wi-Fi services in the library and Block A will be down for scheduled maintenance on Sunday...",
      content: "Wi-Fi services in the library and Block A will be down for scheduled maintenance on Sunday from 10:00 AM to 2:00 PM. We apologize for the inconvenience.",
      author: "IT Admin",
      date: "11 Feb 2026",
      category: "Urgent",
      isPinned: true,
      isNew: false,
      hasAttachment: false
    },
    {
      id: 3,
      title: "Tech-Fest 2026 Registration Open",
      preview: "Join the biggest tech event of the year! Hackathons, Robotics, and Coding challenges await.",
      content: "Join the biggest tech event of the year! Hackathons, Robotics, and Coding challenges await. Early bird registration closes on 20th Feb. Visit the student portal to register your team.",
      author: "Student Council",
      date: "10 Feb 2026",
      category: "Event",
      isPinned: false,
      isNew: false,
      hasAttachment: true
    },
    {
      id: 4,
      title: "Submission of Assignment 3",
      preview: "Deadline for Cloud Computing Assignment 3 has been extended by 2 days.",
      content: "Due to server issues, the deadline for Cloud Computing Assignment 3 has been extended by 2 days. The new submission date is 18th Feb.",
      author: "Prof. Aarti Dadheech",
      date: "09 Feb 2026",
      category: "Academic",
      isPinned: false,
      isNew: false,
      hasAttachment: false
    }
  ];

  // --- FILTER LOGIC ---
  const getFilteredData = () => {
    let data = announcementsData;
    if (activeFilter !== 'All') {
      data = data.filter(item => item.category === activeFilter);
    }
    return data;
  };

  const pinnedItems = getFilteredData().filter(item => item.isPinned);
  const normalItems = getFilteredData().filter(item => !item.isPinned);

  return (
    <div className="announcement-container">
      
      {/* 1. HEADER */}
      <div className="page-header">
        <h2>
          <FaBullhorn style={{ color: 'var(--accent)' }} /> Announcements
        </h2>
        
        {/* Only Visible to Admin/Faculty (Simulated) */}
        <div className="header-actions">
          <button className="btn-create">
            <FaPlus /> Post Announcement
          </button>
        </div>
      </div>

      {/* 2. FILTERS */}
      <div className="filter-bar">
        {['All', 'Academic', 'Exam', 'Event', 'Urgent'].map(filter => (
          <button 
            key={filter}
            className={`filter-chip ${activeFilter === filter ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* 3. PINNED ANNOUNCEMENTS */}
      {pinnedItems.length > 0 && (
        <div className="section-group">
          <div className="section-label">
            <FaThumbtack /> Pinned & Important
          </div>
          <div className="announcement-list">
            {pinnedItems.map(item => (
              <AnnouncementCard 
                key={item.id} 
                data={item} 
                onClick={() => setSelectedAnnouncement(item)} 
              />
            ))}
          </div>
        </div>
      )}

      {/* 4. RECENT ANNOUNCEMENTS */}
      <div className="section-group">
        <div className="section-label">
          <FaCalendarAlt /> Recent Updates
        </div>
        <div className="announcement-list">
          {normalItems.map(item => (
            <AnnouncementCard 
              key={item.id} 
              data={item} 
              onClick={() => setSelectedAnnouncement(item)} 
            />
          ))}
          {normalItems.length === 0 && <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>No announcements found.</p>}
        </div>
      </div>

      {/* 5. MODAL (View Details) */}
      {selectedAnnouncement && (
        <div className="modal-overlay" onClick={() => setSelectedAnnouncement(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setSelectedAnnouncement(null)}>
              <FaTimes />
            </button>
            
            <div className="modal-header">
              <span className={`status-pill status-${selectedAnnouncement.category.toLowerCase()}`}>
                {selectedAnnouncement.category}
              </span>
              <h2 style={{ marginTop: '10px', fontSize: '1.3rem', color: 'var(--text-primary, #0f172a)', fontFamily: 'Sora, sans-serif', fontWeight: 700, letterSpacing: '-0.3px' }}>
                {selectedAnnouncement.title}
              </h2>
            </div>

            <div className="modal-body">
              <p>{selectedAnnouncement.content}</p>
            </div>

            {selectedAnnouncement.hasAttachment && (
              <button className="btn-create" style={{ marginTop: '18px', width: '100%', justifyContent: 'center' }}>
                <FaDownload /> Download Attachment
              </button>
            )}

            <div className="modal-meta">
              <span>Posted by <strong>{selectedAnnouncement.author}</strong></span>
              <span style={{ color: 'var(--card-border, #e2e8f0)' }}>•</span>
              <span>{selectedAnnouncement.date}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// Helper Component for the Card
const AnnouncementCard = ({ data, onClick }) => {
  return (
    <div className={`announce-card cat-${data.category.toLowerCase()} ${data.isPinned ? 'pinned' : ''}`} onClick={onClick}>
      
      <div className="card-header">
        <div className="card-title">
          {data.isPinned && <FaThumbtack size={11} />}
          {data.title}
          {data.isNew && <span className="new-badge">NEW</span>}
        </div>
        <span className="card-date">{data.date}</span>
      </div>

      <p className="card-preview">
        {data.preview}
      </p>

      <div className="card-footer">
        <div className="footer-left">
          <span className="author-tag">{data.author}</span>
          <span style={{ color: 'var(--card-border, #e2e8f0)' }}>|</span>
          <span>{data.category}</span>
        </div>

        {data.hasAttachment && (
          <div className="attachment-badge">
            <FaPaperclip /> Attachment
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;