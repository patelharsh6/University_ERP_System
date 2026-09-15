// src/pages/student/Announcements.jsx
import React, { useState } from 'react';
import './Announcements.css';
import { 
  FaBullhorn, FaThumbtack, FaPaperclip, FaCalendarAlt, 
  FaTimes, FaDownload 
} from 'react-icons/fa';
import { useApi } from '../../hooks/useApi';
import { endpoints } from '../../services/endpoints';
import { formatDate } from '../../utils/format';
import Skeleton from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';

const Announcements = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const { data: announcementsData, loading, error, refetch } = useApi(endpoints.announcements.list, {
    params: { page_size: 100 }
  });

  const rawList = Array.isArray(announcementsData)
    ? announcementsData
    : (announcementsData?.results || []);

  const normalizedList = rawList.map(item => {
    const cat = item.priority === 'urgent'
      ? 'Urgent'
      : item.priority === 'high'
      ? 'Exam'
      : item.priority === 'low'
      ? 'Event'
      : 'Academic';
    return {
      id: item.id,
      title: item.title,
      preview: item.content?.length > 120 ? item.content.slice(0, 120) + '...' : item.content,
      content: item.content,
      author: item.author_name || 'Administration',
      date: item.created_at ? formatDate(item.created_at) : 'Recent',
      category: cat,
      isPinned: Boolean(item.is_pinned),
      isNew: item.created_at ? (Date.now() - new Date(item.created_at).getTime() < 7 * 24 * 3600 * 1000) : false,
      hasAttachment: Boolean(item.attachment),
      attachmentUrl: item.attachment || null
    };
  });

  // --- FILTER LOGIC ---
  const getFilteredData = () => {
    let data = normalizedList;
    if (activeFilter !== 'All') {
      data = data.filter(item => item.category === activeFilter);
    }
    return data;
  };

  const pinnedItems = getFilteredData().filter(item => item.isPinned);
  const normalItems = getFilteredData().filter(item => !item.isPinned);

  if (loading) {
    return (
      <div className="announcement-container" style={{ padding: '24px' }}>
        <Skeleton variant="card" height={60} style={{ marginBottom: '20px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          <Skeleton variant="card" height={160} />
          <Skeleton variant="card" height={160} />
          <Skeleton variant="card" height={160} />
          <Skeleton variant="card" height={160} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="announcement-container" style={{ padding: '24px' }}>
        <ErrorState error={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="announcement-container">
      {/* 1. HEADER */}
      <div className="page-header">
        <h2>
          <FaBullhorn style={{ color: 'var(--accent)' }} /> Announcements
        </h2>
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

      {normalizedList.length === 0 ? (
        <EmptyState
          icon={FaBullhorn}
          title="No Announcements Yet"
          description="There are currently no active announcements published for your department."
        />
      ) : (
        <>
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
              {normalItems.length === 0 && (
                <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>No announcements found for this filter.</p>
              )}
            </div>
          </div>
        </>
      )}

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
              <p style={{ whiteSpace: 'pre-line', lineHeight: '1.7' }}>{selectedAnnouncement.content}</p>
            </div>

            {selectedAnnouncement.hasAttachment && selectedAnnouncement.attachmentUrl && (
              <a 
                href={selectedAnnouncement.attachmentUrl} 
                target="_blank" 
                rel="noreferrer"
                className="btn-create" 
                style={{ marginTop: '18px', width: '100%', justifyContent: 'center', textDecoration: 'none' }}
              >
                <FaDownload /> Download Attachment
              </a>
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