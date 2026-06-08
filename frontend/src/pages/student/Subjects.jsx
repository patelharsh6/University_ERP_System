// src/pages/student/Subjects.jsx
import React, { useState } from 'react';
import './Subjects.css';
import { FiBookOpen, FiFileText, FiVideo, FiDownload, FiCheckCircle, FiClock, FiCircle } from 'react-icons/fi';

const Subjects = () => {
  const [selectedSubject, setSelectedSubject] = useState('CE601');
  const [activeTab, setActiveTab] = useState('modules');

  const subjectsList = [
    { id: 'CE601', name: 'Database Management Systems' },
    { id: 'CE602', name: 'Artificial Intelligence' },
    { id: 'CE603', name: 'Computer Networks' },
  ];

  // Mock data for the selected subject
  const subjectData = {
    modules: [
      { id: 1, title: 'Unit 1: Introduction to DBMS', progress: 100, status: 'done' },
      { id: 2, title: 'Unit 2: Relational Model & SQL', progress: 100, status: 'done' },
      { id: 3, title: 'Unit 3: Normalization', progress: 60, status: 'progress' },
      { id: 4, title: 'Unit 4: Transaction Management', progress: 0, status: 'pending' },
      { id: 5, title: 'Unit 5: Concurrency Control', progress: 0, status: 'pending' },
    ],
    materials: [
      { id: 1, name: 'Intro_to_DBMS.pdf', type: 'pdf', size: '2.4 MB', date: '10 Jan 2026' },
      { id: 2, name: 'SQL_Commands_CheatSheet.pdf', type: 'pdf', size: '1.1 MB', date: '15 Jan 2026' },
      { id: 3, name: 'Normalization_Rules.ppt', type: 'ppt', size: '4.8 MB', date: '02 Feb 2026' },
      { id: 4, name: 'Transaction_Logs_Example.doc', type: 'doc', size: '500 KB', date: '20 Feb 2026' },
    ],
    syllabus: `
      1. Introduction to Database Systems
      2. Data Models and Relational Database Design
      3. SQL Query Language
      4. Database Design and Normalization
      5. Transaction Processing and Concurrency Control
      6. Recovery Systems
    `
  };

  const renderStatus = (status) => {
    switch(status) {
      case 'done': return <span className="module-status status-done"><FiCheckCircle/> Completed</span>;
      case 'progress': return <span className="module-status status-progress"><FiClock/> In Progress</span>;
      default: return <span className="module-status status-pending"><FiCircle/> Pending</span>;
    }
  };

  return (
    <div className="subjects-container">
      
      {/* HEADER & SELECT */}
      <div className="subjects-header">
        <h1>Course Subjects</h1>
        <select 
          className="subject-select"
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          {subjectsList.map(sub => (
            <option key={sub.id} value={sub.id}>{sub.id} - {sub.name}</option>
          ))}
        </select>
      </div>

      {/* TABS */}
      <div className="subjects-tabs">
        <button 
          className={`tab-button ${activeTab === 'modules' ? 'active' : ''}`}
          onClick={() => setActiveTab('modules')}
        >
          Modules
        </button>
        <button 
          className={`tab-button ${activeTab === 'materials' ? 'active' : ''}`}
          onClick={() => setActiveTab('materials')}
        >
          Study Materials
        </button>
        <button 
          className={`tab-button ${activeTab === 'syllabus' ? 'active' : ''}`}
          onClick={() => setActiveTab('syllabus')}
        >
          Syllabus
        </button>
      </div>

      {/* CONTENT */}
      <div className="tab-content">
        
        {activeTab === 'modules' && (
          <div className="modules-list">
            {subjectData.modules.map(mod => (
              <div key={mod.id} className="module-item">
                <div className="module-header">
                  <h3 className="module-title">{mod.title}</h3>
                  {renderStatus(mod.status)}
                </div>
                <div className="module-progress-bar">
                  <div className="progress-fill" style={{ width: `${mod.progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'materials' && (
          <div className="materials-grid">
            {subjectData.materials.map(mat => (
              <div key={mat.id} className="material-card">
                <div className={`material-icon ${mat.type}`}>
                  {mat.type === 'pdf' ? <FiFileText /> : mat.type === 'ppt' ? <FiVideo /> : <FiBookOpen />}
                </div>
                <div className="material-info">
                  <div className="material-name">{mat.name}</div>
                  <div className="material-meta">{mat.size} • {mat.date}</div>
                </div>
                <button className="btn-download" title="Download">
                  <FiDownload size={18} />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'syllabus' && (
          <div className="syllabus-view" style={{ whiteSpace: 'pre-line', lineHeight: '1.8' }}>
            {subjectData.syllabus}
          </div>
        )}

      </div>
    </div>
  );
};

export default Subjects;
