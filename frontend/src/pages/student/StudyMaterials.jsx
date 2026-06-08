// src/pages/student/StudyMaterials.jsx
import React, { useState } from 'react';
import './StudyMaterials.css';
import { FiBookOpen, FiDownload, FiEye, FiSearch, FiFileText, FiVideo, FiArchive, FiFile } from 'react-icons/fi';

const StudyMaterials = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');

  const mockMaterials = [
    { id: 1, title: 'Chapter 1: Intro to Databases', subject: 'CE601 - DBMS', type: 'pdf', size: '2.4 MB', date: '10 Jan 2026' },
    { id: 2, title: 'Relational Algebra Examples', subject: 'CE601 - DBMS', type: 'doc', size: '1.2 MB', date: '15 Jan 2026' },
    { id: 3, title: 'A* Algorithm Slides', subject: 'CE602 - Artificial Intelligence', type: 'ppt', size: '4.8 MB', date: '02 Feb 2026' },
    { id: 4, title: 'Heuristic Search Exercises', subject: 'CE602 - Artificial Intelligence', type: 'pdf', size: '1.8 MB', date: '05 Feb 2026' },
    { id: 5, title: 'OSI Model Deep Dive', subject: 'CE603 - Computer Networks', type: 'ppt', size: '5.2 MB', date: '20 Feb 2026' },
    { id: 6, title: 'Network Packet Traces', subject: 'CE603 - Computer Networks', type: 'zip', size: '14.5 MB', date: '22 Feb 2026' },
    { id: 7, title: 'Agile vs Waterfall Notes', subject: 'CE604 - Software Engineering', type: 'pdf', size: '3.1 MB', date: '01 Mar 2026' },
  ];

  const subjects = ['All Subjects', 'CE601 - DBMS', 'CE602 - Artificial Intelligence', 'CE603 - Computer Networks', 'CE604 - Software Engineering'];

  const getIconForType = (type) => {
    switch(type) {
      case 'pdf': return <FiFileText />;
      case 'ppt': return <FiVideo />;
      case 'doc': return <FiFile />;
      case 'zip': return <FiArchive />;
      default: return <FiFileText />;
    }
  };

  const filteredMaterials = mockMaterials.filter(mat => {
    const matchesSubject = selectedSubject === 'All Subjects' || mat.subject === selectedSubject;
    const matchesSearch = mat.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          mat.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="materials-container">
      
      <div className="materials-header">
        <h1><FiBookOpen style={{ color: 'var(--mat-accent)' }} /> Study Materials</h1>
        
        <div className="materials-filters">
          <input 
            type="text" 
            className="mat-search" 
            placeholder="Search materials..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select 
            className="mat-select"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            {subjects.map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="materials-grid">
        {filteredMaterials.map(mat => (
          <div key={mat.id} className="mat-card">
            
            <div className={`mat-icon-wrapper ${mat.type}`}>
              {getIconForType(mat.type)}
            </div>

            <div className="mat-info">
              <h3 className="mat-title">{mat.title}</h3>
              <div className="mat-subject">{mat.subject}</div>
              <div className="mat-meta">
                <span>{mat.size}</span>
                <span>•</span>
                <span>{mat.date}</span>
                <span>•</span>
                <span style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{mat.type}</span>
              </div>
            </div>

            <div className="mat-actions">
              <button className="btn-icon" title="View Document">
                <FiEye />
              </button>
              <button className="btn-icon" title="Download">
                <FiDownload />
              </button>
            </div>

          </div>
        ))}
        
        {filteredMaterials.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--mat-text-muted)' }}>
            No materials found matching your criteria.
          </div>
        )}
      </div>

    </div>
  );
};

export default StudyMaterials;
