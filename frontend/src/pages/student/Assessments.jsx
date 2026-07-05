// src/pages/student/Assessments.jsx
import React, { useState } from 'react';
import './Assessments.css';
import { FiList, FiClock, FiCheckCircle, FiFileText, FiUploadCloud, FiAlertCircle, FiMessageSquare } from 'react-icons/fi';

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const assessmentsData = [
  {
    id: 1,
    title: 'DBMS Project: ER Diagram & Normalization',
    course: 'CE601 - Database Management Systems',
    type: 'Project',
    status: 'pending',
    dueDate: '2026-02-25T23:59:00',
    displayDate: '25 Feb 2026, 11:59 PM',
    weightage: '15%',
    instructions: 'Create an ER diagram for a hospital management system and normalize the schema to 3NF. Submit as a single PDF.',
  },
  {
    id: 2,
    title: 'Assignment 3: A* Search Algorithm Implementation',
    course: 'CE602 - Artificial Intelligence',
    type: 'Assignment',
    status: 'pending',
    dueDate: '2026-02-28T23:59:00',
    displayDate: '28 Feb 2026, 11:59 PM',
    weightage: '10%',
    instructions: 'Implement the A* algorithm in Python to solve the 8-puzzle problem. Include the source code and a README file.',
  },
  {
    id: 3,
    title: 'Quiz 2: Subnetting & Routing Protocols',
    course: 'CE603 - Computer Networks',
    type: 'Quiz',
    status: 'pending',
    dueDate: '2026-03-05T10:00:00',
    displayDate: '5 Mar 2026, 10:00 AM',
    weightage: '5%',
    instructions: 'Online quiz via portal. 20 MCQs, 30 minutes. Ensure a stable internet connection.',
  },
  {
    id: 4,
    title: 'Assignment 1: SDLC Models',
    course: 'CE604 - Software Engineering',
    type: 'Assignment',
    status: 'completed',
    dueDate: '2026-02-10T23:59:00',
    displayDate: '10 Feb 2026, 11:59 PM',
    submittedOn: '09 Feb 2026, 04:30 PM',
    weightage: '10%',
    grade: '18 / 20',
    feedback: 'Good comparison of Agile and Waterfall models. Real-world examples were highly relevant.',
  },
  {
    id: 5,
    title: 'Lab Record: Socket Programming',
    course: 'CE603P - Computer Networks Lab',
    type: 'Lab',
    status: 'completed',
    dueDate: '2026-02-15T23:59:00',
    displayDate: '15 Feb 2026, 11:59 PM',
    submittedOn: '15 Feb 2026, 10:15 PM',
    weightage: '20%',
    grade: 'Pending Review',
    feedback: null,
  }
];

const Assessments = () => {
  const [activeTab, setActiveTab] = useState('pending');

  const pending = assessmentsData.filter(a => a.status === 'pending');
  const completed = assessmentsData.filter(a => a.status === 'completed');

  const displayList = activeTab === 'pending' ? pending : completed;

  return (
    <div className="assessments-page">
      {/* ── HEADER ── */}
      <div className="assessments-header">
        <div className="assessments-title-group">
          <div className="assessments-icon"><FiList size={24} /></div>
          <div>
            <h1 className="assessments-title">Assessments</h1>
            <p className="assessments-subtitle">Track assignments, projects, and quizzes</p>
          </div>
        </div>
      </div>

      {/* ── KPI STRIP ── */}
      <div className="assessments-kpi-strip">
        <div className="ast-kpi pending">
          <FiAlertCircle size={24} className="ast-icon" />
          <div>
            <span className="ast-val">{pending.length}</span>
            <span className="ast-label">Pending</span>
          </div>
        </div>
        <div className="ast-kpi completed">
          <FiCheckCircle size={24} className="ast-icon" />
          <div>
            <span className="ast-val">{completed.length}</span>
            <span className="ast-label">Completed</span>
          </div>
        </div>
        <div className="ast-kpi total">
          <FiFileText size={24} className="ast-icon" />
          <div>
            <span className="ast-val">{assessmentsData.length}</span>
            <span className="ast-label">Total Assigned</span>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="ast-tabs">
        <button 
          className={`ast-tab ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          To Do ({pending.length})
        </button>
        <button 
          className={`ast-tab ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed ({completed.length})
        </button>
      </div>

      {/* ── LIST ── */}
      <div className="ast-list">
        {displayList.map(item => (
          <div key={item.id} className="ast-card">
            <div className="ast-card-top">
              <span className={`ast-type-badge type-${item.type.toLowerCase()}`}>{item.type}</span>
              <span className="ast-weightage">{item.weightage} Weightage</span>
            </div>
            
            <h3 className="ast-card-title">{item.title}</h3>
            <p className="ast-card-course">{item.course}</p>
            
            <div className="ast-card-meta">
              <div className="ast-meta-item due-date">
                <FiClock size={14} /> 
                <span>Due: <strong>{item.displayDate}</strong></span>
              </div>
              {item.status === 'completed' && (
                <div className="ast-meta-item submit-date">
                  <FiCheckCircle size={14} /> 
                  <span>Submitted: <strong>{item.submittedOn}</strong></span>
                </div>
              )}
            </div>

            {item.instructions && (
              <div className="ast-instructions">
                <strong>Instructions:</strong> {item.instructions}
              </div>
            )}

            {item.status === 'completed' && item.grade && (
              <div className="ast-grading-box">
                <div className="ast-grade-score">
                  <span className="label">Grade</span>
                  <span className="score">{item.grade}</span>
                </div>
                {item.feedback && (
                  <div className="ast-feedback">
                    <FiMessageSquare size={14} />
                    <p>"{item.feedback}"</p>
                  </div>
                )}
              </div>
            )}

            <div className="ast-card-actions">
              {item.status === 'pending' ? (
                <>
                  <button className="ast-btn primary"><FiUploadCloud size={14} /> Submit Work</button>
                  <button className="ast-btn secondary">View Details</button>
                </>
              ) : (
                <button className="ast-btn secondary">View Submission</button>
              )}
            </div>
          </div>
        ))}
        {displayList.length === 0 && (
          <div className="ast-empty">
            <FiCheckCircle size={48} />
            <p>You're all caught up! No {activeTab} assessments.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assessments;
