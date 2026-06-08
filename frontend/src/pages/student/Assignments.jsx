// src/pages/student/Assignments.jsx
import React, { useState } from 'react';
import './Assignments.css';
import { FiBookOpen, FiCalendar, FiClock, FiUploadCloud, FiCheckCircle, FiFileText, FiAlertCircle } from 'react-icons/fi';

const Assignments = () => {
  const [activeTab, setActiveTab] = useState('pending');

  const mockAssignments = [
    {
      id: 1,
      title: 'Database Schema Design Project',
      subject: 'CE601 - Database Management Systems',
      deadline: '15 Jun 2026',
      time: '11:59 PM',
      status: 'pending',
      marks: null
    },
    {
      id: 2,
      title: 'Machine Learning Algorithm Analysis',
      subject: 'CE602 - Artificial Intelligence',
      deadline: '10 Jun 2026',
      time: '11:59 PM',
      status: 'pending',
      marks: null
    },
    {
      id: 3,
      title: 'Network Topology Simulation',
      subject: 'CE603 - Computer Networks',
      deadline: '02 Jun 2026',
      time: '10:00 AM',
      status: 'submitted',
      marks: null
    },
    {
      id: 4,
      title: 'Software Requirements Specification',
      subject: 'CE604 - Software Engineering',
      deadline: '20 May 2026',
      time: '11:59 PM',
      status: 'graded',
      marks: '18/20'
    },
    {
      id: 5,
      title: 'ER Diagram Exercise',
      subject: 'CE601 - Database Management Systems',
      deadline: '15 May 2026',
      time: '05:00 PM',
      status: 'graded',
      marks: '10/10'
    }
  ];

  const filteredAssignments = mockAssignments.filter(a => a.status === activeTab);
  
  const counts = {
    pending: mockAssignments.filter(a => a.status === 'pending').length,
    submitted: mockAssignments.filter(a => a.status === 'submitted').length,
    graded: mockAssignments.filter(a => a.status === 'graded').length,
  };

  const handleUpload = (e) => {
    if(e.target.files.length > 0) {
      alert(`File "${e.target.files[0].name}" uploaded successfully!`);
    }
  };

  return (
    <div className="assignments-container">
      
      <div className="assignments-header">
        <h1><FiFileText style={{ color: 'var(--assign-accent)' }} /> Course Assignments</h1>
        <p>Manage your pending tasks and view graded submissions.</p>
      </div>

      <div className="assign-tabs">
        <button 
          className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending <span className="tab-badge">{counts.pending}</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'submitted' ? 'active' : ''}`}
          onClick={() => setActiveTab('submitted')}
        >
          Submitted <span className="tab-badge">{counts.submitted}</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'graded' ? 'active' : ''}`}
          onClick={() => setActiveTab('graded')}
        >
          Graded <span className="tab-badge">{counts.graded}</span>
        </button>
      </div>

      <div className="assign-list">
        {filteredAssignments.length === 0 ? (
          <div className="empty-state">
            <FiCheckCircle className="empty-icon" />
            <h3>No {activeTab} assignments</h3>
            <p>You're all caught up!</p>
          </div>
        ) : (
          filteredAssignments.map(assign => (
            <div key={assign.id} className={`assign-card ${assign.status}`}>
              
              <div className="assign-info">
                <h3 className="assign-title">{assign.title}</h3>
                <div className="assign-subject">
                  <FiBookOpen /> {assign.subject}
                </div>
                <div className="assign-meta">
                  <div className="meta-item">
                    <FiCalendar /> Due: {assign.deadline}
                  </div>
                  <div className="meta-item">
                    <FiClock /> {assign.time}
                  </div>
                </div>
              </div>

              <div className="assign-actions">
                <span className={`assign-status status-${assign.status}`}>
                  {assign.status === 'pending' && <><FiAlertCircle style={{marginBottom: '-2px'}}/> Pending</>}
                  {assign.status === 'submitted' && <><FiCheckCircle style={{marginBottom: '-2px'}}/> Under Review</>}
                  {assign.status === 'graded' && 'Graded'}
                </span>

                {assign.status === 'pending' && (
                  <div className="file-input-wrapper">
                    <button className="btn-action btn-primary">
                      <FiUploadCloud /> Upload Submission
                    </button>
                    <input type="file" onChange={handleUpload} />
                  </div>
                )}

                {assign.status === 'submitted' && (
                  <button className="btn-action">
                    <FiFileText /> View Submission
                  </button>
                )}

                {assign.status === 'graded' && (
                  <div className="grade-score">{assign.marks}</div>
                )}
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default Assignments;
